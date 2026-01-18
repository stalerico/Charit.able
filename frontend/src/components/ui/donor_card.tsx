import React, { MouseEvent as ReactMouseEvent, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// Demo Component
const Demo = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [selectedAmount, setSelectedAmount] = useState<
        number | "other" | null
    >(null);
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

  const background = useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(14, 165, 233, 0.15), transparent 80%)`;

    return (
        <div
            className="group relative max-w-md rounded-xl border border-white/10 bg-gray-900 px-8 py-16 shadow-2xl"
            onMouseMove={handleMouseMove}
        >
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
                        type="button"
                        onClick={() => setSelectedAmount("other")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            selectedAmount === "other"
                                ? "bg-sky-500 text-white"
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
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-full rounded-md border border-white/20 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Enter custom amount"
                        />
                    </div>
                )}
                <button className="mt-6 inline-block rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 ease-in-out hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                    Donate Now
                </button>
                <p className="mt-6 text-base leading-7 text-gray-300">
                    Most people donate $50!
                </p>
            </div>
        </div>
    );
};

function Donate() {
    return (
        <>
            <Demo />
        </>
    );
}

export default Donate;
