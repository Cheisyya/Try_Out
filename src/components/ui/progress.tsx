import { cn } from "@/lib/utils";

export function Progress({
  nilai,
  className,
  tone = "navy",
}: {
  /** Nilai 0 - 100 */
  nilai: number;
  className?: string;
  tone?: "navy" | "gold";
}) {
  const lebar = Math.min(100, Math.max(0, nilai));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-50", className)}
      role="progressbar"
      aria-valuenow={lebar}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all",
          tone === "navy" ? "bg-navy-700" : "bg-gold-400",
        )}
        style={{ width: `${lebar}%` }}
      />
    </div>
  );
}
