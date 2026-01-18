import { StreamflowSolana, ICluster, ICreateStreamData, IWithdrawData, ICancelData } from "@streamflow/stream";
import { Keypair, clusterApiUrl } from "@solana/web3.js";
import BN from "bn.js";
import bs58 from "bs58";

// Release stages as percentages (cumulative milestones)
export const RELEASE_STAGES = [
  { index: 0, name: "Initial Release", percentage: 5 },
  { index: 1, name: "Stage 2", percentage: 15 },
  { index: 2, name: "Stage 3", percentage: 30 },
  { index: 3, name: "Stage 4 - Final", percentage: 50 },
];

interface CreateMilestoneStreamParams {
  recipientPublicKey: string;
  amountLamports: bigint;
  milestoneIndex: number;
  milestoneName: string;
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
  private client: InstanceType<typeof StreamflowSolana.SolanaStreamClient>;
  private senderKeypair: Keypair;
  private cluster: ICluster;

  constructor() {
    // Load configuration from environment
    this.cluster = (process.env.SOLANA_CLUSTER as ICluster) || "devnet";

    const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl(this.cluster as any);

    // Initialize Streamflow client
    this.client = new StreamflowSolana.SolanaStreamClient(rpcUrl, this.cluster);

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
   * Calculate the amount for each milestone based on total donation amount.
   */
  calculateMilestoneAmounts(totalAmountLamports: bigint) {
    return RELEASE_STAGES.map((stage) => ({
      index: stage.index,
      name: stage.name,
      percentage: stage.percentage,
      amountLamports: (totalAmountLamports * BigInt(stage.percentage)) / 100n,
    }));
  }

  /**
   * Create a stream for a specific milestone.
   * This is called when a milestone proof is verified, releasing funds for that stage.
   * Each milestone gets its own stream that transfers immediately to the recipient.
   */
  async createMilestoneStream(params: CreateMilestoneStreamParams) {
    const { recipientPublicKey, amountLamports, milestoneIndex, milestoneName, tokenMint } = params;

    console.log(`Creating milestone stream:`);
    console.log(`  Milestone: ${milestoneIndex} - ${milestoneName}`);
    console.log(`  Recipient: ${recipientPublicKey}`);
    console.log(`  Amount: ${amountLamports} lamports (${Number(amountLamports) / 1e9} SOL)`);
    console.log(`  Token: ${tokenMint || "Native SOL"}`);

    const now = Math.floor(Date.now() / 1000);
    // Start 5 seconds in the future (minimal delay for transaction validity)
    const startTime = now + 5;

    // Convert bigint to BN for the Streamflow SDK
    const amountBN = new BN(amountLamports.toString());

    // Create a stream that releases funds immediately after start
    // Using minimal vesting period so recipient can claim right away
    const createStreamParams: ICreateStreamData = {
      // Recipient (fundee wallet)
      recipient: recipientPublicKey,

      // Token mint (SOL wrapped = native SOL)
      tokenId: tokenMint || "So11111111111111111111111111111111111111112",

      // Stream starts shortly after creation
      start: startTime,

      // Total amount for this milestone
      amount: amountBN,

      // Immediate release - 1 second period with full amount
      period: 1,
      cliff: 0,
      cliffAmount: new BN(0),
      amountPerPeriod: amountBN,

      // Stream name includes milestone info
      name: `M${milestoneIndex + 1}`,

      // Permissions - sender can cancel if needed (e.g., fraud detected)
      cancelableBySender: true,
      cancelableByRecipient: false,
      transferableBySender: false,
      transferableByRecipient: false,

      // No automatic withdrawal - recipient claims when ready
      canTopup: false,
      automaticWithdrawal: false,
      withdrawalFrequency: 0,
    };

    try {
      const result = await this.client.create(createStreamParams, {
        sender: this.senderKeypair,
        isNative: !tokenMint || tokenMint === "So11111111111111111111111111111111111111112",
      });

      console.log(`Milestone stream created!`);
      console.log(`  Stream ID: ${result.metadataId}`);
      console.log(`  Transaction: ${result.txId}`);

      return {
        success: true,
        streamId: result.metadataId,
        transactionSignature: result.txId,
        milestoneIndex,
        milestoneName,
        sender: this.senderKeypair.publicKey.toBase58(),
        recipient: recipientPublicKey,
        amount: amountLamports.toString(),
        cluster: this.cluster,
      };
    } catch (error: any) {
      console.error("Failed to create milestone stream:", error);
      throw new Error(`Milestone stream creation failed: ${error.message}`);
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
      id: streamId,
      amount: new BN(amount.toString()),
    };

    try {
      const result = await this.client.withdraw(withdrawParams, {
        invoker: this.senderKeypair,
      });

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
      id: streamId,
    };

    try {
      const result = await this.client.cancel(cancelParams, {
        invoker: this.senderKeypair,
      });

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
        remainingAmount: stream.depositedAmount.sub(stream.withdrawnAmount).toString(),
        status: stream.canceledAt ? "cancelled" : stream.withdrawnAmount.gte(stream.depositedAmount) ? "completed" : "active",
        createdAt: stream.createdAt,
        canceledAt: stream.canceledAt,
      };
    } catch (error: any) {
      console.error("Failed to get stream:", error);
      throw new Error(`Failed to get stream: ${error.message}`);
    }
  }
}
