/**
 * Streamflow Smart Contract Test Script - Milestone-Based Approach
 *
 * Tests the complete donation flow with milestone-based releases:
 * 1. Extract 5% platform fee
 * 2. Keep 95% in platform wallet (held for milestones)
 * 3. For each verified milestone, create a stream that releases funds to recipient
 * 4. Each milestone = separate stream = separate on-chain transaction
 *
 * Run with: npx ts-node src/test-streamflow.ts
 */

import { StreamflowService, RELEASE_STAGES } from "./streamflow";
import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

// Test configuration
const DONATION_AMOUNT_SOL = 0.05; // Total donation amount for devnet testing
const PLATFORM_FEE_PERCENT = 5; // 5% platform fee
const PLATFORM_FEE_SOL = DONATION_AMOUNT_SOL * (PLATFORM_FEE_PERCENT / 100);
const STREAM_AMOUNT_SOL = DONATION_AMOUNT_SOL - PLATFORM_FEE_SOL; // 95% goes to milestones
const STREAM_AMOUNT_LAMPORTS = BigInt(Math.floor(STREAM_AMOUNT_SOL * LAMPORTS_PER_SOL));

// ANSI colors for console output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  bold: "\x1b[1m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log("\n" + "=".repeat(70));
  log(title, colors.bold + colors.cyan);
  console.log("=".repeat(70));
}

function logSubSection(title: string) {
  console.log("\n" + "-".repeat(50));
  log(title, colors.bold + colors.magenta);
  console.log("-".repeat(50));
}

async function getWalletBalance(connection: Connection, publicKey: string): Promise<number> {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  return balance / LAMPORTS_PER_SOL;
}

/**
 * Simple verification check - always returns true for testing
 * In production, this would verify actual proof/milestone completion
 */
function verifyMilestone(milestoneIndex: number): boolean {
  log(`  [Verification] Milestone ${milestoneIndex + 1}: verified = true`, colors.green);
  return true;
}

async function runFullTest() {
  logSection("STREAMFLOW MILESTONE-BASED RELEASE TEST");

  // Get configuration from env
  const privateKey = process.env.PLATFORM_WALLET_PRIVATE_KEY;
  const cluster = process.env.SOLANA_CLUSTER || "devnet";

  if (!privateKey) {
    log("ERROR: PLATFORM_WALLET_PRIVATE_KEY not set in .env", colors.red);
    process.exit(1);
  }

  // Derive sender wallet (platform wallet)
  let platformKeypair: Keypair;
  try {
    if (privateKey.startsWith("[")) {
      const keyArray = JSON.parse(privateKey);
      platformKeypair = Keypair.fromSecretKey(Uint8Array.from(keyArray));
    } else {
      platformKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    }
  } catch (error) {
    log(`ERROR: Invalid private key format: ${error}`, colors.red);
    process.exit(1);
  }

  const platformPublicKey = platformKeypair.publicKey.toBase58();

  // Fundee (recipient) wallet - this is where funds will be sent
  const fundeePublicKey = "BHry98ZuCUzY9EBEJRJ9e3S1NjUAiyB74r7v81fAgkaS";

  // Setup connection
  const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl(cluster as any);
  const connection = new Connection(rpcUrl, "confirmed");

  // ============================================
  // STEP 1: Display Configuration
  // ============================================
  logSection("1. TEST CONFIGURATION");
  log(`Cluster: ${cluster}`, colors.yellow);
  log(`Platform Wallet: ${platformPublicKey}`, colors.cyan);
  log(`Fundee Wallet: ${fundeePublicKey}`, colors.cyan);

  console.log("\nDonation Breakdown:");
  log(`  Total Donation: ${DONATION_AMOUNT_SOL} SOL`, colors.green);
  log(`  Platform Fee (${PLATFORM_FEE_PERCENT}%): ${PLATFORM_FEE_SOL} SOL`, colors.yellow);
  log(`  Amount for Milestones (${100 - PLATFORM_FEE_PERCENT}%): ${STREAM_AMOUNT_SOL} SOL`, colors.green);

  console.log("\nMilestone Release Schedule:");
  let cumulativePercent = 0;
  RELEASE_STAGES.forEach((stage) => {
    cumulativePercent += stage.percentage;
    const stageAmount = STREAM_AMOUNT_SOL * (stage.percentage / 100);
    log(`  Milestone ${stage.index + 1} (${stage.name}): ${stage.percentage}% = ${stageAmount.toFixed(6)} SOL (cumulative: ${cumulativePercent}%)`, colors.yellow);
  });

  log("\nApproach: Each verified milestone creates a separate stream", colors.cyan);
  log("          Funds transfer to recipient immediately upon verification", colors.cyan);

  // ============================================
  // STEP 2: Check Balance
  // ============================================
  logSection("2. WALLET BALANCE CHECK");
  const initialBalance = await getWalletBalance(connection, platformPublicKey);
  log(`Platform Wallet Balance: ${initialBalance} SOL`, colors.green);

  const requiredBalance = DONATION_AMOUNT_SOL + 0.05; // Extra for transaction fees (multiple streams)
  if (initialBalance < requiredBalance) {
    log(`\nERROR: Insufficient balance!`, colors.red);
    log(`Required: ${requiredBalance} SOL (${DONATION_AMOUNT_SOL} donation + ~0.05 fees for multiple txs)`, colors.yellow);
    log(`Available: ${initialBalance} SOL`, colors.yellow);
    log(`\nTo get devnet SOL:`, colors.yellow);
    log(`  solana airdrop 1 ${platformPublicKey} --url devnet`, colors.cyan);
    process.exit(1);
  }
  log(`Balance is sufficient for test.`, colors.green);

  // ============================================
  // STEP 3: Simulate Platform Fee Extraction
  // ============================================
  logSection("3. PLATFORM FEE EXTRACTION (Simulated)");
  log(`Extracting ${PLATFORM_FEE_PERCENT}% platform fee: ${PLATFORM_FEE_SOL} SOL`, colors.yellow);
  log(`Remaining for milestones: ${STREAM_AMOUNT_SOL} SOL (${STREAM_AMOUNT_LAMPORTS} lamports)`, colors.green);
  // In production, this would be an actual SOL transfer to a fee wallet
  log(`[Simulated] Fee retained in platform wallet`, colors.yellow);

  // ============================================
  // STEP 4: Initialize Streamflow Service
  // ============================================
  logSection("4. INITIALIZING STREAMFLOW SERVICE");
  let streamflowService: StreamflowService;
  try {
    streamflowService = new StreamflowService();
    log("Streamflow service initialized successfully!", colors.green);
  } catch (error) {
    log(`Failed to initialize Streamflow service: ${error}`, colors.red);
    process.exit(1);
  }

  // Calculate milestone amounts
  const milestoneAmounts = streamflowService.calculateMilestoneAmounts(STREAM_AMOUNT_LAMPORTS);
  log("\nCalculated milestone amounts:", colors.cyan);
  milestoneAmounts.forEach((m) => {
    log(`  Milestone ${m.index + 1} (${m.name}): ${Number(m.amountLamports) / LAMPORTS_PER_SOL} SOL`, colors.yellow);
  });

  // ============================================
  // STEP 5: Release Funds via Milestone Streams
  // ============================================
  logSection("5. MILESTONE-BASED FUND RELEASES");
  log("Each verified milestone will create a new stream to transfer funds.", colors.yellow);
  log("Funds are held in platform wallet until milestone verification.\n", colors.yellow);

  let totalReleased = 0n;
  const streamIds: string[] = [];

  for (const milestone of milestoneAmounts) {
    logSubSection(`MILESTONE ${milestone.index + 1}: ${milestone.name} (${milestone.percentage}%)`);

    const milestoneAmountSOL = Number(milestone.amountLamports) / LAMPORTS_PER_SOL;
    log(`Amount to release: ${milestoneAmountSOL.toFixed(6)} SOL (${milestone.amountLamports} lamports)`, colors.yellow);

    // Verification check - always true for testing
    const verified = verifyMilestone(milestone.index);
    if (!verified) {
      log(`Milestone ${milestone.index + 1} verification FAILED - funds remain locked`, colors.red);
      continue;
    }

    // Create a stream for this milestone
    log(`\nCreating stream for milestone ${milestone.index + 1}...`, colors.yellow);
    try {
      const result = await streamflowService.createMilestoneStream({
        recipientPublicKey: fundeePublicKey,
        amountLamports: milestone.amountLamports,
        milestoneIndex: milestone.index,
        milestoneName: milestone.name,
      });

      totalReleased += milestone.amountLamports;
      streamIds.push(result.streamId);

      log(`\nMilestone ${milestone.index + 1} stream created!`, colors.green);
      log(`  Stream ID: ${result.streamId}`, colors.cyan);
      log(`  Transaction: ${result.transactionSignature}`, colors.cyan);
      log(`\nView on Solana Explorer:`, colors.yellow);
      log(`  https://explorer.solana.com/tx/${result.transactionSignature}?cluster=${cluster}`, colors.cyan);
      log(`View on Streamflow:`, colors.yellow);
      log(`  https://app.streamflow.finance/contract/solana/${cluster}/${result.streamId}`, colors.cyan);

      // Show running total
      const totalReleasedSOL = Number(totalReleased) / LAMPORTS_PER_SOL;
      const percentReleased = (Number(totalReleased) / Number(STREAM_AMOUNT_LAMPORTS)) * 100;
      log(`\nRunning total released: ${totalReleasedSOL.toFixed(6)} SOL (${percentReleased.toFixed(1)}%)`, colors.magenta);

    } catch (error: any) {
      log(`\nMilestone ${milestone.index + 1} stream creation failed: ${error.message}`, colors.red);
      console.error(error);
      // Continue to next milestone anyway for testing
    }

    // Wait between milestones (for transaction confirmation and to simulate time passing)
    if (milestone.index < milestoneAmounts.length - 1) {
      log(`\nWaiting 10 seconds before next milestone...`, colors.yellow);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  // ============================================
  // STEP 6: Verify All Streams
  // ============================================
  logSection("6. VERIFY ALL MILESTONE STREAMS");
  log("Waiting 10 seconds for final confirmations...\n", colors.yellow);
  await new Promise(resolve => setTimeout(resolve, 10000));

  for (let i = 0; i < streamIds.length; i++) {
    const streamId = streamIds[i];
    try {
      const streamInfo = await streamflowService.getStream(streamId);
      if (streamInfo) {
        log(`Milestone ${i + 1} Stream (${streamId}):`, colors.cyan);
        log(`  Status: ${streamInfo.status}`, colors.green);
        log(`  Deposited: ${Number(streamInfo.depositedAmount) / LAMPORTS_PER_SOL} SOL`, colors.yellow);
        log(`  Withdrawn: ${Number(streamInfo.withdrawnAmount) / LAMPORTS_PER_SOL} SOL`, colors.yellow);
        log(`  Remaining: ${Number(streamInfo.remainingAmount) / LAMPORTS_PER_SOL} SOL`, colors.yellow);
        console.log();
      }
    } catch (error: any) {
      log(`Failed to verify stream ${streamId}: ${error.message}`, colors.red);
    }
  }

  // ============================================
  // STEP 7: Final Balance Check
  // ============================================
  logSection("7. FINAL BALANCE CHECK");
  const finalBalance = await getWalletBalance(connection, platformPublicKey);
  log(`Platform Wallet Final Balance: ${finalBalance} SOL`, colors.green);
  log(`Balance change: ${(finalBalance - initialBalance).toFixed(6)} SOL`, colors.yellow);

  log(`\nFunds were sent to fundee wallet: ${fundeePublicKey}`, colors.green);

  // ============================================
  // SUMMARY
  // ============================================
  logSection("TEST SUMMARY");
  log(`Total Donation: ${DONATION_AMOUNT_SOL} SOL`, colors.green);
  log(`Platform Fee (${PLATFORM_FEE_PERCENT}%): ${PLATFORM_FEE_SOL} SOL`, colors.yellow);
  log(`Total for Milestones: ${STREAM_AMOUNT_SOL} SOL`, colors.green);
  log(`Total Released: ${Number(totalReleased) / LAMPORTS_PER_SOL} SOL`, colors.green);
  log(`Streams Created: ${streamIds.length}`, colors.cyan);

  if (streamIds.length === RELEASE_STAGES.length) {
    log(`\nAll ${RELEASE_STAGES.length} milestones completed successfully!`, colors.bold + colors.green);
  } else {
    log(`\n${streamIds.length}/${RELEASE_STAGES.length} milestones completed.`, colors.yellow);
  }

  log(`\nStream IDs:`, colors.cyan);
  streamIds.forEach((id, i) => {
    log(`  Milestone ${i + 1}: ${id}`, colors.yellow);
    log(`    https://app.streamflow.finance/contract/solana/${cluster}/${id}`, colors.cyan);
  });
}

// Run the test
runFullTest().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
