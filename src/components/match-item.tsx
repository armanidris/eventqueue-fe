import { cn } from "@/lib/utils";

type MatchItemProps = {
  matchName: string;
  teamA: string;
  teamB: string;
  isCurrent?: boolean;
  isNextUp?: boolean;
};

export function MatchItem({
  matchName,
  teamA,
  teamB,
  isCurrent = false,
  isNextUp = false,
}: MatchItemProps) {
  return (
    <div
      className={cn(
        "p-3 border rounded-lg mb-2 transition-all",
        isCurrent
          ? "bg-green-100 border-green-500"
          : isNextUp
          ? "bg-blue-50 border-blue-300"
          : "bg-white"
      )}
    >
      <div className="font-medium">{matchName}</div>
      <div className="flex justify-between mt-1 text-sm">
        <span>{teamA}</span>
        <span className="font-bold">VS</span>
        <span>{teamB}</span>
      </div>
      {isCurrent && (
        <div className="mt-2 text-xs text-green-600 font-semibold">
          SEDANG BERMAIN
        </div>
      )}
    </div>
  );
}