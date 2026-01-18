import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

<<<<<<< HEAD
const Demo = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
=======
type DonationSelection = number | "other" | null;

type DonorCardProps = {
    onDonate?: (amount: number) => void;
    onAmountChange?: (amount: number | null) => void;
};

const DonorCard = ({ onDonate, onAmountChange }: DonorCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [selectedAmount, setSelectedAmount] =
        useState<DonationSelection>(null);
    const [customAmount, setCustomAmount] = useState("");
>>>>>>> f7dcbad1f2ff11fa00f985d3835d7908f6bef8d8

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

<<<<<<< HEAD
    const data = await res.json();
    return data.onramp_url;
  }
=======
      async function startDonation() {
        const res = await fetch("http://127.0.0.1:8000/api/v1/onramp/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                source_amount_usd: "100.00",
            }),
        });
        if (!res.ok) {
            let message = "Failed to create onramp session";
            try {
                const err = await res.json();
                if (err && err.detail) {
                    if (typeof err.detail === "string") {
                        message = err.detail;
                    } else if (err.detail.message) {
                        message = err.detail.message;
                    } else {
                        message = JSON.stringify(err.detail);
                    }
                }
            } catch (e) {
                console.error(e);
            }
            throw new Error(message);
        }
>>>>>>> f7dcbad1f2ff11fa00f985d3835d7908f6bef8d8

  const background = useMotionTemplate`
    radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(14, 233, 83, 0.15), transparent 80%)
  `;

<<<<<<< HEAD
  return (
    <div
      className="group relative max-w-3xl rounded-xl border border-white/10 bg-gray-900 px-10 py-20 shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />
=======
  const background = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(14, 233, 83, 0.15), transparent 80%)`;
    const parsedCustomAmount = Number(customAmount);
    const donationAmount =
        selectedAmount === "other" ? parsedCustomAmount : selectedAmount;
    const isDonateDisabled =
        !donationAmount || Number.isNaN(donationAmount) || donationAmount <= 0;

    function handlePresetClick(amount: number) {
        setSelectedAmount(amount);
        setCustomAmount("");
        onAmountChange?.(amount);
    }

    function handleOtherClick() {
        setSelectedAmount("other");
        onAmountChange?.(null);
    }

    function handleDonateClick() {
        if (!isDonateDisabled && donationAmount) {
            onDonate?.(donationAmount);
        }
    }
>>>>>>> f7dcbad1f2ff11fa00f985d3835d7908f6bef8d8

      <div>
        <span className="text-5xl font-bold tracking-tight text-white">
          Donate Today!
        </span>

<<<<<<< HEAD
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
=======
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{ background }}
            />
            <div>
                <div className="mt-2 flex items-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-white">
                        Donate
                    </span>
                </div>

                <div id="donate-amount" className="mt-4 flex flex-wrap gap-2">
                    {presetAmounts.map((amount) => {
                        const isSelected = selectedAmount === amount;
                        return (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => handlePresetClick(amount)}
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
                        type="button"
                        onClick={handleOtherClick}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            selectedAmount === "other"
                                ? "bg-black text-green-500"
                                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                        }`}
                    >
                        Other
                    </button>
                </div>
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
                                    !nextValue || Number.isNaN(parsed) || parsed <= 0
                                        ? null
                                        : parsed
                                );
                            }}
                            className="w-full rounded-md border border-white/20 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Enter custom amount"
                        />
                    </div>
                )}
                <button
                    type="button"
                    onClick={handleDonateClick}
                    disabled={isDonateDisabled}
                    className="mt-6 inline-block rounded-full bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 ease-in-out hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:bg-sky-700/60"
                >
                    Donate Now
                </button>
                <p className="mt-6 text-base leading-7 text-gray-300">
                    Most people donate $50!
                </p>
            </div>
>>>>>>> f7dcbad1f2ff11fa00f985d3835d7908f6bef8d8
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

<<<<<<< HEAD
function Donate() {
  return <Demo />;
}

export default Donate;
=======
export default DonorCard;
>>>>>>> f7dcbad1f2ff11fa00f985d3835d7908f6bef8d8
