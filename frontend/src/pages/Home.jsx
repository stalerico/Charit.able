import { useNavigate } from "react-router-dom";
import TypingAnimatedText from "../components/TypingAnimatedText.tsx";
import Navbar from "../components/navbar.tsx";
import DonorCard from "../components/ui/donor_card";
import RecentSales from "../components/RecentSales.tsx";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css"; // import CSS
import ItemizedBarcode from "../assets/images/ItemizedBarcode.jpg";
import ReceiptOverlay from "../assets/images/ItemizedBarcodeOverlay.jpg";
export default function Home() {
    const navigate = useNavigate();
    async function startDonation(amount) {
        const res = await fetch("http://127.0.0.1:8000/api/v1/onramp/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                source_amount_usd: amount.toFixed(2),
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

        const data = await res.json();
        return data.onramp_url;
    }

    return (
        <>
            <Navbar />
            <TypingAnimatedText
                words={[
                    "Charit.able: Empowering Giving",
                    "Transparent Donations, Instant Impact",
                    "Crypto-powered, Community-focused",
                ]}
            />

            <main className="flex flex-col items-center text-center mt-24 px-2">
                {/* Hero Section */}
                <h1 className="text-5xl font-extrabold text-gray-700 dark:text-white">
                    Give with Confidence, Make a Difference
                </h1>

                <p className="mt-6 text-lg text-gray-400 dark:text-gray-300 max-w-2xl">
                    Charit.able is a revolutionary platform that connects donors
                    with causes that matter. Powered by blockchain technology,
                    every donation is secure, transparent, and traceable.
                    Experience the future of giving where generosity meets
                    trust.
                </p>

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-6 py-3 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 transition"
                    >
                        Join Now
                    </button>

                    <button
                        onClick={() => navigate("/wallet_testing")}
                        className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition"
                    >
                        Explore Wallet
                    </button>
                </div>
                <DonorCard
                    onDonate={async (amount) => {
                        try {
                            const onrampUrl = await startDonation(amount);
                            if (onrampUrl) {
                                window.location.href = onrampUrl;
                            }
                        } catch (e) {
                            console.error(e);
                            alert(e.message || "Failed to start donation flow");
                        }
                    }}
                />
                <div className="items-center mt-8 w-1/2">
                    <RecentSales />
                </div>

                {/* Footer Blurb */}
                <p className="mt-24 mb-12 text-gray-500 dark:text-gray-400 max-w-2xl">
                    Join thousands of contributors worldwide and help make the
                    world a better place. Every donation, no matter the size,
                    creates real impact — instantly visible on our platform.
                </p>
            </main>
        </>
    );
}
