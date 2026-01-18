import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { card_info } from "../data/card_info";
import { charity_info } from "../data/charity_info";
import DonorCard from "../components/ui/donor_card";

export default function CharityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const charity = useMemo(() => card_info.find((c) => c.slug === slug), [slug]);
  const details = charity_info[slug] ?? null;

  if (!charity) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Back
        </button>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-xl font-semibold">Charity not found</h1>
          <p className="mt-2 text-white/60">No charity matches: {slug}</p>
        </div>
      </div>
    );
  }

  const trustScore = details?.trustScore ?? 60; // fallback score
  const trustLabel =
    trustScore >= 80 ? "High trust" : trustScore >= 60 ? "Moderate trust" : "Low trust";

  // Tailwind color by score (red -> yellow -> green)
  const trustColor =
    trustScore >= 80
      ? "from-emerald-400 to-emerald-300"
      : trustScore >= 60
      ? "from-yellow-400 to-yellow-300"
      : "from-rose-500 to-rose-400";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* header image */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={details?.bannerUrl ?? charity.imageUrl}
          alt=""
          className="h-full w-full overflow-hidden object-cover"
          onError={(e) => (e.currentTarget.src = "/images/fallback.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

        <div className="absolute left-0 right-0 bottom-0 mx-auto max-w-6xl p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/80 hover:bg-black/60"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">{charity.title}</h1>
          <p className="mt-2 max-w-2xl text-white/70">{charity.description}</p>
        </div>
      </div>

      {/* body */}
      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-3">
        {/* left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trust Score (main) */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Trust Score</h2>
                <p className="mt-1 text-sm text-white/60">
                  Based on how reliably this org completes the escrow + receipt verification flow.
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold">{trustScore}</div>
                <div className="text-xs text-white/60">{trustLabel}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${trustColor}`}
                  style={{ width: `${Math.max(0, Math.min(100, trustScore))}%` }}
                />
              </div>

              <div className="mt-3 grid gap-2 text-sm text-white/70">
                <div className="flex items-start gap-2">
                  <span className="mt-[3px] inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  <span>
                    Donations go into a <b>smart contract escrow</b>.
                    We release <b>25%</b> immediately to help them start work.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-[3px] inline-block h-2 w-2 rounded-full bg-cyan-400" />
                  <span>
                    They upload <b>receipts / proof</b>. Once verified, the remaining funds are released.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-[3px] inline-block h-2 w-2 rounded-full bg-yellow-300" />
                  <span>
                    The score increases when receipts are verified quickly and decreases when receipts are late/invalid.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 text-white/70">
              {details?.about ??
                "This organization is verified on our platform. Donations are held in escrow and released based on proof-of-use (receipts/milestones)."}
            </p>
          </section>

          {/* Impact / Transparency */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Impact & Transparency</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Stat label="Funds Tracked" value={details?.impact?.fundsTracked ?? "—"} />
              <Stat label="Programs" value={details?.impact?.programs ?? "—"} />
              <Stat label="Last Update" value={details?.impact?.lastUpdate ?? "—"} />
            </div>
            <p className="mt-4 text-sm text-white/60">
              Data here is hardcoded for now; later it can come from on-chain events + receipt verification records.
            </p>
          </section>

          {/* Recent Activity */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>

            <ul className="mt-3 space-y-3">
              {(details?.recentActivity ?? defaultRecentActivity(slug)).map((a, i) => (
                <li
                  key={`${a.ts}-${a.type}-${i}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white">{a.type}</div>
                    <div className="text-xs text-white/50">{a.ts}</div>
                  </div>
                  <div className="mt-1 text-sm text-white/70">{a.detail}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* right */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Donate</h2>
            <p className="mt-2 text-sm text-white/60">
              Pick an amount and we will start the Coinbase onramp flow.
            </p>

            <div className="mt-4">
              <DonorCard />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip text="Crypto" />
              <Chip text="Escrow" />
              <Chip text="Receipts" />
              <Chip text={details?.verification?.status ?? "Verified"} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Payout Rules</h2>
            <div className="mt-3 space-y-3 text-sm text-white/70">
              {(details?.verification?.payoutSchedule ?? defaultPayout()).map((p, idx) => (
                <div key={idx} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-white">{p.stage}</div>
                    <div className="text-xs text-white/60">{p.percent}%</div>
                  </div>
                  <div className="mt-1 text-sm text-white/70">{p.trigger}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Details</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <Detail label="Slug" value={charity.slug} />
              <Detail label="Category" value={details?.category ?? "—"} />
              <Detail label="Website" value={details?.website ?? "—"} />
              <Detail label="Wallet" value={details?.wallet ?? "—"} />
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function Chip({ text }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
      {text}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-white/60">{label}</dt>
      <dd className="max-w-[60%] truncate text-right text-white/90">{value}</dd>
    </div>
  );
}

// fallback activity if a slug isn't in charity_info yet
function defaultRecentActivity(slug) {
  const base = slug.replaceAll("-", " ");
  return [
    { ts: "2026-01-17", type: "Donation received", detail: `New USDC donation escrowed for ${base}` },
    { ts: "2026-01-16", type: "Receipt pending", detail: "Awaiting documentation upload to unlock final payout" },
    { ts: "2026-01-15", type: "Update posted", detail: "Org posted a progress update to donors" },
  ];
}

function defaultPayout() {
  return [
    { stage: "Initial release", percent: 25, trigger: "Donation received (smart contract escrow)" },
    { stage: "Receipt verified", percent: 75, trigger: "Receipt upload + platform verification" },
  ];
}
