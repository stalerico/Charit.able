import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const Demo = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [selectedAmount, setSelectedAmount] = useState<number | "other" | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const presetAmounts = [5, 10, 20, 50, 100];

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  async function startDonation() {
    const amount =
      selectedAmount === "other" ? customAmount : selectedAmount;

    const res = await fetch("http://127.0.0.1:8000/api/v1/onramp/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_amount_usd: amount?.toString() || "10.00",
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create onramp session");
    }

    const data = await res.json();
    return data.onramp_url;
  }

  const background = useMotionTemplate`
    radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(14, 233, 83, 0.15), transparent 80%)
  `;

  return (
    <div
      className="group relative max-w-3xl rounded-xl border border-white/10 bg-gray-900 px-10 py-20 shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      <div>
        <span className="text-5xl font-bold tracking-tight text-white">
          Donate Today!
        </span>

        {/* Preset Amount Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {presetAmounts.map((amount) => {
            const isSelected = selectedAmount === amount;
            return (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
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
            onClick={() => setSelectedAmount("other")}
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
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter custom amount"
            />
          </div>
        )}

        {/* Donate Button (BLACK) */}
        <button
          onClick={async () => {
            try {
              const onrampUrl = await startDonation();
              if (onrampUrl) window.location.href = onrampUrl;
            } catch (e: any) {
              console.error(e);
              alert(e.message || "Failed to start donation flow");
            }
          }}
          className="mt-6 inline-block rounded-md bg-black px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-500"
        >
          Donate Now
        </button>

        <p className="mt-6 text-base text-gray-300">
          Most people donate $50!
        </p>
      </div>
    </div>
  );
};

function Donate() {
  return <Demo />;
}

export default Donate;
