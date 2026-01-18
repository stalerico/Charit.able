import {
  StreamflowSolana,
  ICluster,
  ICreateStreamData,
  IWithdrawData,
  ICancelData,
  getBN,
} from "@streamflow/stream";
import { Keypair, PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import bs58 from "bs58";

// Release stages as percentages
const RELEASE_STAGES = [
  { index: 0, percentage: 5 },
  { index: 1, percentage: 15 },
  { index: 2, percentage: 30 },
  { index: 3, percentage: 50 },
];

interface CreateStreamParams {
  recipientPublicKey: string;
  totalAmountLamports: bigint;
  tokenMint?: string;
}

interface WithdrawParams {
  streamId: string;
  amount: bigint;
}

interface CancelParams {
  streamId: string;
}

export class StreamflowService {
  private client: StreamflowSolana;
  private senderKeypair: Keypair;
  private cluster: ICluster;
  private connection: Connection;

  constructor() {
    // Load configuration from environment
    this.cluster = (process.env.SOLANA_CLUSTER as ICluster) || "devnet";

    const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl(this.cluster);
    this.connection = new Connection(rpcUrl, "confirmed");

    // Initialize Streamflow client
    this.client = new StreamflowSolana({
      clusterUrl: rpcUrl,
      cluster: this.cluster,
    });

    // Load sender wallet from private key
    const privateKey = process.env.PLATFORM_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PLATFORM_WALLET_PRIVATE_KEY not set");
    }

    try {
      // Support both base58 and JSON array formats
      if (privateKey.startsWith("[")) {
        const keyArray = JSON.parse(privateKey);
        this.senderKeypair = Keypair.fromSecretKey(Uint8Array.from(keyArray));
      } else {
        // Base58 encoded
        this.senderKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
      }
    } catch (error) {
      throw new Error(`Invalid private key format: ${error}`);
    }

    console.log(`Streamflow service initialized`);
    console.log(`Cluster: ${this.cluster}`);
    console.log(`Sender wallet: ${this.senderKeypair.publicKey.toBase58()}`);
  }

  /**
   * Create a new stream that locks funds in the Streamflow smart contract.
   * The stream is created with all funds locked, to be released in stages.
   */
  async createStream(params: CreateStreamParams) {
    const { recipientPublicKey, totalAmountLamports, tokenMint } = params;

    console.log(`Creating on-chain stream:`);
    console.log(`  Recipient: ${recipientPublicKey}`);
    console.log(`  Amount: ${totalAmountLamports} lamports`);
    console.log(`  Token: ${tokenMint}`);

    // Calculate stream duration - we use a long duration since we control releases manually
    // 1 year in seconds
    const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;

    const now = Math.floor(Date.now() / 1000);

    const createStreamParams: ICreateStreamData = {
      // Sender (our platform wallet)
      sender: this.senderKeypair,

      // Recipient (fundee wallet)
      recipient: recipientPublicKey,

      // Token mint (SOL wrapped = native SOL)
      mint: tokenMint || "So11111111111111111111111111111111111111112",

      // Stream starts now
      start: now,

      // Total amount to stream (in token base units)
      depositedAmount: getBN(totalAmountLamports, 9), // 9 decimals for SOL

      // Period for unlocking (1 second = granular control)
      period: 1,

      // Cliff - no initial cliff, we handle via withdrawals
      cliff: now,
      cliffAmount: getBN(0, 9),

      // Amount unlocked per period (full amount / duration)
      // This makes all funds available immediately for withdrawal
      amountPerPeriod: getBN(totalAmountLamports, 9),

      // Stream name
      name: `Charit.able-${Date.now()}`,

      // Permissions
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: false,
      transferableByRecipient: false,

      // Automatic withdrawal settings
      canTopup: false,
      automaticWithdrawal: false,
      withdrawalFrequency: 0,
    };

    try {
      const result = await this.client.create(createStreamParams);

      console.log(`Stream created on-chain!`);
      console.log(`  Stream ID: ${result.metadataId}`);
      console.log(`  Transaction: ${result.txId}`);

      return {
        success: true,
        streamId: result.metadataId,
        transactionSignature: result.txId,
        sender: this.senderKeypair.publicKey.toBase58(),
        recipient: recipientPublicKey,
        totalAmount: totalAmountLamports.toString(),
        cluster: this.cluster,
        stages: RELEASE_STAGES.map((stage) => ({
          index: stage.index,
          percentage: stage.percentage,
          amountLamports: (
            (totalAmountLamports * BigInt(stage.percentage)) /
            100n
          ).toString(),
        })),
      };
    } catch (error: any) {
      console.error("Failed to create stream on-chain:", error);
      throw new Error(`On-chain stream creation failed: ${error.message}`);
    }
  }

  /**
   * Withdraw funds from a stream (release to recipient).
   * This is called when a proof is verified to release the next stage.
   */
  async withdraw(params: WithdrawParams) {
    const { streamId, amount } = params;

    console.log(`Withdrawing from stream:`);
    console.log(`  Stream ID: ${streamId}`);
    console.log(`  Amount: ${amount} lamports`);

    const withdrawParams: IWithdrawData = {
      invoker: this.senderKeypair, // Platform initiates withdrawal on behalf of recipient
      id: streamId,
      amount: getBN(amount, 9),
    };

    try {
      const result = await this.client.withdraw(withdrawParams);

      console.log(`Withdrawal successful!`);
      console.log(`  Transaction: ${result.txId}`);

      return {
        success: true,
        streamId,
        amountWithdrawn: amount.toString(),
        transactionSignature: result.txId,
      };
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      throw new Error(`Withdrawal failed: ${error.message}`);
    }
  }

  /**
   * Cancel a stream and return remaining funds to sender.
   */
  async cancel(params: CancelParams) {
    const { streamId } = params;

    console.log(`Cancelling stream: ${streamId}`);

    const cancelParams: ICancelData = {
      invoker: this.senderKeypair,
      id: streamId,
    };

    try {
      const result = await this.client.cancel(cancelParams);

      console.log(`Stream cancelled!`);
      console.log(`  Transaction: ${result.txId}`);

      return {
        success: true,
        streamId,
        transactionSignature: result.txId,
      };
    } catch (error: any) {
      console.error("Cancel failed:", error);
      throw new Error(`Cancel failed: ${error.message}`);
    }
  }

  /**
   * Get stream details from on-chain.
   */
  async getStream(streamId: string) {
    try {
      const stream = await this.client.getOne({ id: streamId });

      if (!stream) {
        return null;
      }

      return {
        streamId,
        sender: stream.sender,
        recipient: stream.recipient,
        mint: stream.mint,
        depositedAmount: stream.depositedAmount.toString(),
        withdrawnAmount: stream.withdrawnAmount.toString(),
        remainingAmount: (
          stream.depositedAmount - stream.withdrawnAmount
        ).toString(),
        status: stream.canceledAt ? "cancelled" : stream.withdrawnAmount >= stream.depositedAmount ? "completed" : "active",
        createdAt: stream.createdAt,
        canceledAt: stream.canceledAt,
      };
    } catch (error: any) {
      console.error("Failed to get stream:", error);
      throw new Error(`Failed to get stream: ${error.message}`);
    }
  }
}
