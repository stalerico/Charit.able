import React from "react";
import { loadStripeOnramp } from "@stripe/crypto";

const stripeOnrampPromise = loadStripeOnramp(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
);

export default function WalletTesting() {
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
            const err = await res.json();
            throw new Error(err.detail || "Failed to create onramp session");
        } else {
            const { client_secret } = await res.json();
            return client_secret;
        }
    }

    return (
        <div>
            <h1>Wallet Testing</h1>
            <button
                onClick={async () => {
                    try {
                        const clientSecret = await startDonation();
                        const stripeOnramp = await stripeOnrampPromise;
                        const onrampSession = stripeOnramp.createSession({
                            clientSecret,
                        });
                        onrampSession.mount("#onramp-container");
                    } catch (e) {
                        console.error(e);
                    }
                }}
            >
                Donate
            </button>
            <div id="onramp-container" style={{ minHeight: 600 }} />
        </div>
    );
}
