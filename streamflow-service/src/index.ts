import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { StreamflowService, RELEASE_STAGES } from "./streamflow";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize Streamflow service
const streamflowService = new StreamflowService();

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy", service: "streamflow-onchain" });
});

// Get milestone configuration
app.get("/milestones", (_req: Request, res: Response) => {
  res.json({ stages: RELEASE_STAGES });
});

// Calculate milestone amounts for a donation
app.post("/milestones/calculate", (req: Request, res: Response) => {
  try {
    const { totalAmountLamports } = req.body;

    if (!totalAmountLamports) {
      return res.status(400).json({ error: "Missing totalAmountLamports" });
    }

    const milestones = streamflowService.calculateMilestoneAmounts(BigInt(totalAmountLamports));
    res.json({ milestones });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a milestone stream (release funds for a verified milestone)
app.post("/streams/milestone", async (req: Request, res: Response) => {
  try {
    const { recipientPublicKey, amountLamports, milestoneIndex, milestoneName, tokenMint } = req.body;

    if (!recipientPublicKey || !amountLamports || milestoneIndex === undefined || !milestoneName) {
      return res.status(400).json({ error: "Missing required fields: recipientPublicKey, amountLamports, milestoneIndex, milestoneName" });
    }

    const result = await streamflowService.createMilestoneStream({
      recipientPublicKey,
      amountLamports: BigInt(amountLamports),
      milestoneIndex,
      milestoneName,
      tokenMint,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Create milestone stream error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Withdraw from stream (release funds to recipient)
app.post("/streams/withdraw", async (req: Request, res: Response) => {
  try {
    const { streamId, amount } = req.body;

    if (!streamId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await streamflowService.withdraw({
      streamId,
      amount: BigInt(amount),
    });

    res.json(result);
  } catch (error: any) {
    console.error("Withdraw error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel stream (return remaining funds to sender)
app.post("/streams/cancel", async (req: Request, res: Response) => {
  try {
    const { streamId } = req.body;

    if (!streamId) {
      return res.status(400).json({ error: "Missing streamId" });
    }

    const result = await streamflowService.cancel({ streamId });

    res.json(result);
  } catch (error: any) {
    console.error("Cancel error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get stream info from on-chain
app.get("/streams/:streamId", async (req: Request, res: Response) => {
  try {
    const { streamId } = req.params;

    const result = await streamflowService.getStream(Array.isArray(streamId) ? streamId[0] : streamId);

    if (!result) {
      return res.status(404).json({ error: "Stream not found" });
    }

    res.json(result);
  } catch (error: any) {
    console.error("Get stream error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Streamflow on-chain service running on port ${PORT}`);
  console.log(`Cluster: ${process.env.SOLANA_CLUSTER || "devnet"}`);
});
