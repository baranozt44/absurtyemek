type AdSlotSize = "leaderboard" | "rectangle" | "in-feed";

type AdSlotProps = {
  slot: string;
  label: string;
  size?: AdSlotSize;
  className?: string;
};

const sizeClasses: Record<AdSlotSize, string> = {
  leaderboard: "min-h-24 sm:min-h-28",
  rectangle: "min-h-48",
  "in-feed": "min-h-32",
};

export default function AdSlot({
  slot,
  label,
  size = "leaderboard",
  className = "",
}: AdSlotProps) {
  const adsMode = process.env.NEXT_PUBLIC_ADS_MODE;

  if (adsMode !== "placeholder") {
    return null;
  }

  return (
    <aside
      aria-label="Reklam alani"
      data-ad-slot={slot}
      className={`pointer-events-none flex w-full items-center justify-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-900/40 px-4 py-6 text-center ${sizeClasses[size]} ${className}`}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Reklam Alani
        </p>
        <p className="mt-2 text-sm font-medium text-zinc-500">{label}</p>
      </div>
    </aside>
  );
}
