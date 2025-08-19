import { Card } from "@/components/ui/card";
import { MatchItem } from "./match-item";

type CourtCardProps = {
  courtName: string;
  currentMatch: {
    matchName: string;
    teamA: string;
    teamB: string;
  };
  queue: Array<{
    matchName: string;
    teamA: string;
    teamB: string;
  }>;
};

export function CourtCard({ courtName, currentMatch, queue }: CourtCardProps) {
  return (
    <Card className="p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-3 text-center">{courtName}</h2>
      
      {/* Current Match */}
      <div className="mb-4">
        <MatchItem {...currentMatch} isCurrent />
      </div>

      {/* Queue List */}
      <h3 className="text-sm font-semibold mb-2">Antrian Berikutnya:</h3>
      <div className="space-y-2">
        {queue.map((match, index) => (
          <MatchItem 
            key={index} 
            {...match} 
            isNextUp={index === 0} 
          />
        ))}
      </div>
    </Card>
  );
}