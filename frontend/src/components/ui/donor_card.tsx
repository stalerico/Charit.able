import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

type DonationSelection = number | "other" | null;

type DonorCardProps = {
  onDonate?: (amount: number) => void;
  onAmountChange?: (amount: number | null) => void;
};

const DonorCard = ({ onDonate, onAmountChange }: DonorCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [selectedAmount, setSelectedAmount] = useState<DonationSelection>(null);
  const [customAmount, setCustomAmount] = useState("");

  const presetAmounts = [5, 10, 20, 50, 100];

  function handleMouseMove({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`
    radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(14, 233, 83, 0.15), transparent 80%)
  `;

  const parsedCustomAmount = Number(customAmount);
  const donationAmount = selectedAmount === "other" ? parsedCustomAmount : selectedAmount;
  const isDonateDisabled = !donationAmount || Number.isNaN(donationAmount) || donationAmount <= 0;

  function handlePresetClick(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
    onAmountChange?.(amount);
  }

  function handleOtherClick() {
    setSelectedAmount("other");
    onAmountChange?.(null);
  }

  async function startDonation() {
    if (isDonateDisabled) return;
    const amount = donationAmount!;
    const res = await fetch("http://127.0.0.1:8000/api/v1/onramp/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_amount_usd: amount.toString() }),
    });
    
    if (!res.ok) {
      let errorMessage = "Failed to create onramp session";
      try {
        const errorData = await res.json();
        console.error("Server error:", errorData);
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === "string" 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        }
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    return data.onramp_url;
  }

  return (
    <div
      className="group relative w-full h-full rounded-xl border border-white/10 bg-[#0E131F] px-10 py-6 shadow-2xl flex justify-center"
      onMouseMove={handleMouseMove}
    >

      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      <div className="relative z-10 flex flex-col items-center text-center pt-10">
        <span className="text-4xl font-bold text-gray-300">
          Donate Today!
        </span>

        {/* Preset Amount Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {presetAmounts.map((amount) => {
            const isSelected = selectedAmount === amount;
            return (
              <button
                key={amount}
                onClick={() => handlePresetClick(amount)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-black text-green-500"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              >
                ${amount}
              </button>
            );
          })}

          <button
            onClick={handleOtherClick}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedAmount === "other"
                ? "bg-black text-green-500"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
          >
            Enter Other
          </button>
        </div>

        {/* Custom Amount Input */}
        {selectedAmount === "other" && (
          <div className="mt-3">
            <input
              type="number"
              min="1"
              step="1"
              value={customAmount}
              onChange={(e) => {
                const nextValue = e.target.value;
                setCustomAmount(nextValue);
                const parsed = Number(nextValue);
                onAmountChange?.(
                  !nextValue || Number.isNaN(parsed) || parsed <= 0 ? null : parsed
                );
              }}
              className="w-full !rounded-md border border-white/20 bg-[#0E131F] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter custom amount"
            />
          </div>
        )}

        {/* Donate Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              const onrampUrl = await startDonation();
              if (onrampUrl) window.location.href = onrampUrl;
            } catch (e: any) {
              console.error(e);
              alert(e.message || "Failed to start donation flow");
            }
          }}
          disabled={isDonateDisabled}
          className="mt-6 inline-block rounded-md !rounded_md bg-black px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-black/50"
          style={{borderRadius: "10px"}}
        >
          Donate
        </button>

        <p className="mt-6 text-base text-gray-300">
          Most people donate $50!
        </p>
      </div>
    </div>
  );
};

export default DonorCard;
