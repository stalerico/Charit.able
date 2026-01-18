import React, { useState } from "react";
import Navbar from "../components/navbar.tsx";

const API_BASE_URL = "http://127.0.0.1:8000";

function formatSol(value) {
  if (value === null || value === undefined) {
    return "--";
  }
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function CompanyDashboard() {
  const [companyWallet, setCompanyWallet] = useState("");
  const [walletData, setWalletData] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptStatus, setReceiptStatus] = useState("");
  const [receiptError, setReceiptError] = useState("");

  async function fetchBalances() {
    setWalletLoading(true);
    setWalletError("");
    try {
      const url = new URL(`${API_BASE_URL}/api/v1/dashboard/wallets`);
      if (companyWallet.trim()) {
        url.searchParams.set("company_wallet", companyWallet.trim());
      }
      const res = await fetch(url.toString());
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.detail || "Failed to load wallet balances");
      }
      const data = await res.json();
      setWalletData(data);
    } catch (error) {
      setWalletError(error.message || "Unable to load balances");
    } finally {
      setWalletLoading(false);
    }
  }

  async function handleReceiptUpload() {
    if (!receiptFile) {
      setReceiptError("Select a receipt file first.");
      return;
    }

    setReceiptStatus("");
    setReceiptError("");
    try {
      const formData = new FormData();
      formData.append("file", receiptFile);
      const res = await fetch(`${API_BASE_URL}/api/v1/receipts/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.detail || "Receipt upload failed");
      }
      const data = await res.json();
      setReceiptStatus(`Uploaded ${data.filename} (${data.receipt_id}).`);
      setReceiptFile(null);
    } catch (error) {
      setReceiptError(error.message || "Unable to upload receipt");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <section className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80">
              Company Console
            </p>
            <h1 className="text-4xl font-bold sm:text-5xl">
              Company Dashboard
            </h1>
            <p className="max-w-2xl text-base text-white/70">
              Track treasury health, upload receipts, and keep your donors in the
              loop with real-time wallet visibility.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                    Main Treasury
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-emerald-300">
                    {formatSol(walletData?.main_wallet?.balance_sol)} SOL
                  </p>
                </div>
                <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs uppercase text-emerald-200">
                  Primary
                </span>
              </div>
              <p className="mt-4 text-xs text-white/50">
                {walletData?.main_wallet?.address || "Set WALLET_ADDRESS in the server .env"}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                    Company Wallet
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-sky-300">
                    {formatSol(walletData?.company_wallet?.balance_sol)} SOL
                  </p>
                </div>
                <span className="rounded-full border border-sky-400/40 px-3 py-1 text-xs uppercase text-sky-200">
                  Company
                </span>
              </div>
              <p className="mt-4 text-xs text-white/50">
                {walletData?.company_wallet?.address || "Enter a company wallet below"}
              </p>
            </section>

            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Wallet Lookup
              </p>
              <p className="mt-3 text-sm text-white/70">
                Enter your company wallet to pull balances in real time.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <input
                  type="text"
                  value={companyWallet}
                  onChange={(event) => setCompanyWallet(event.target.value)}
                  placeholder="Company wallet address"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                />
                <button
                  type="button"
                  onClick={fetchBalances}
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
                  disabled={walletLoading}
                >
                  {walletLoading ? "Refreshing..." : "Refresh balances"}
                </button>
                {walletError ? (
                  <p className="text-xs text-red-300">{walletError}</p>
                ) : null}
              </div>
            </section>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                    Receipt Upload
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Verify usage instantly
                  </h2>
                </div>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase text-white/70">
                  PDF or Image
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                Upload receipts so donors can see where funds were spent.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(event) => setReceiptFile(event.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleReceiptUpload}
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
                >
                  Upload receipt
                </button>
              </div>
              {receiptStatus ? (
                <p className="mt-4 text-xs text-emerald-200">{receiptStatus}</p>
              ) : null}
              {receiptError ? (
                <p className="mt-4 text-xs text-red-300">{receiptError}</p>
              ) : null}
            </section>

            <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                Impact Snapshot
              </p>
              <div className="mt-4 space-y-4 text-sm text-white/70">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span>Receipts verified this month</span>
                  <span className="text-lg font-semibold text-emerald-200">18</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span>Pending donor updates</span>
                  <span className="text-lg font-semibold text-sky-200">3</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span>Next release milestone</span>
                  <span className="text-lg font-semibold text-white">Stage 2</span>
                </div>
              </div>
              <p className="mt-5 text-xs text-white/50">
                Hook this section into your receipts and streamflow data when ready.
              </p>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

export default CompanyDashboard;
