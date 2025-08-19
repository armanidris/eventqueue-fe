import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Flame, Clock, Medal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const StatusBadge = ({ status }) => {
  const cfg = {
    ongoing: { label: "Berlangsung", variant: "destructive", Icon: Flame },
    next: { label: "Selanjutnya", variant: "secondary", Icon: Clock },
    queued: { label: "Antri", variant: "outline", Icon: Clock },
    done: { label: "Selesai", variant: "default", Icon: Medal },
  }[status] || { label: status, variant: "outline", Icon: Clock };
  const { Icon } = cfg;
  return (
    <Badge variant={cfg.variant} className="flex items-center gap-1 text-xs">
      <Icon className="h-3.5 w-3.5" /> {cfg.label}
    </Badge>
  );
};

function FighterRow({ corner = "red", fighter = {}, score }) {
  const side =
    corner === "red"
      ? "border-red-500/60 bg-red-500/5"
      : "border-blue-500/60 bg-blue-500/5";
  return (
    <>
      <div>asd</div>
      <div
        className={`flex items-center justify-between rounded-xl border ${side} px-3 py-2`}
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <div>
            <div className="font-semibold leading-tight">
              {fighter?.name || "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {fighter?.club || "—"}
            </div>
          </div>
        </div>
        {typeof score === "number" && (
          <div className="text-2xl font-bold tabular-nums">{score}</div>
        )}
      </div>
    </>
  );
}

export default function Test() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-amber-200">
        <header className="py-6 bg-white shadow-md border-b">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-600 tracking-wide">
            Antrian Pertandingan
          </h1>
        </header>
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="h-full overflow-hidden rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-muted-foreground/60 text-xl font-semibold" />
                    <span className="text-xl font-semibold">Lapangan 1</span>
                  </CardTitle>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-4">
                <FighterRow
                  corner="red"
                  fighter={{ name: "Red", club: "Red" }}
                  score={1}
                />
                <FighterRow
                  corner="blue"
                  fighter={{ name: "Blue", club: "Blue" }}
                  score={2}
                />
              </CardContent>
            </Card>
            <Card className="h-full overflow-hidden rounded-2xl shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold text-center text-black">
                  Lapangan 1
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="h-full overflow-hidden rounded-2xl shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-bold text-center text-black">
                  Lapangan 1
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        </main>
        {/* Footer */}
        <footer className="py-4 bg-white border-t text-center text-gray-600 text-sm">
          <span className="font-semibold">sportygeek</span>
        </footer>
      </div>
    </>
  );
}
