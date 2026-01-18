import React, { useMemo, useState } from "react";
import { card_info } from "../data/card_info";
import { useNavigate } from "react-router-dom";

interface CardProps {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
}

function Card({ slug, title, description, imageUrl }: CardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/charity/${slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        group relative cursor-pointer overflow-hidden rounded-2xl
        border border-white/10 bg-white/5
        shadow-[0_0_0_1px_rgba(255,255,255,0.06)]
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-white/20 hover:bg-white/10
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]
        focus-within:ring-2 focus-within:ring-emerald-400/40
      "
    >
      {/* glow */}
      <div
        className="
          pointer-events-none absolute -inset-1 opacity-0 blur-2xl
          bg-gradient-to-r from-emerald-400/20 via-cyan-400/10 to-purple-400/20
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* image */}
      <div className="relative h-48">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          src={imageUrl}
          alt=""
          loading="lazy"
        />
        {/* dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
      </div>

      {/* content */}
      <div className="relative p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold tracking-tight text-white">
            {title}
          </h3>

          {/* little arrow hint */}
          <div
            className="
              flex h-9 w-9 items-center justify-center rounded-xl
              border border-white/10 bg-white/5 text-white/70
              transition-all duration-300
              group-hover:bg-white/10 group-hover:text-white
            "
          >
            →
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/70">
          {description}
        </p>

        {/* footer row */}
        <div className="mt-4 flex items-center justify-between text-xs text-white/50">
          <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1 backdrop-blur">
            Donate • Track • Impact
          </span>
          <span className="transition-colors group-hover:text-emerald-300/80">
            Click to view
          </span>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 12;

const CardGrid = () => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(card_info.length / PAGE_SIZE));

  const pageCards = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return card_info.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <div className="min-h-screen bg-black">
      {/* optional: subtle background grid/glow */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_60%_80%,rgba(168,85,247,0.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-mono-bold text-white">
              Donation Organizations
            </h2>
            <p className="mt-1 text-md text-white/60 pt-5">
              Browse orgs and click a card to open details.
            </p>
          </div>

          <div className="text-md text-white/60">
            Showing{" "}
            <span className="font-medium text-white/90">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, card_info.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white/90">
              {card_info.length}
            </span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pageCards.map((card: CardProps, index: number) => (
            <Card
              key={card.slug ?? `${card.title}-${index}`}
              slug={card.slug}                 // ✅ pass slug
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
            />
          ))}
        </div>

        {/* pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="
              rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80
              transition hover:bg-white/10 hover:text-white
              disabled:opacity-40 disabled:hover:bg-white/5
            "
          >
            Prev
          </button>

          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            Page <span className="font-semibold text-white">{page}</span> of{" "}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="
              rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80
              transition hover:bg-white/10 hover:text-white
              disabled:opacity-40 disabled:hover:bg-white/5
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardGrid;
