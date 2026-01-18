import React from "react";

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
        <div>
            <h1>Wallet Testing</h1>
            <button
                onClick={async () => {
                    try {
                        const onrampUrl = await startDonation();
                        if (onrampUrl) {
                            window.location.href = onrampUrl;
                        }
                    } catch (e) {
                        console.error(e);
                        alert(e.message || "Failed to start donation flow");
                    }
                }}
            >
                Donate
            </button>
        </div>
    );
}
