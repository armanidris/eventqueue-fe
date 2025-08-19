import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sword, Users, Timer, ChevronRight, Bell, Hash } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

/**
 * Taekwondo Queue Board
 * - 4 responsive cards (rings) on wide screens
 * - TailwindCSS + shadcn/ui components
 * - Clean, public-facing layout with subtle motion
 *
 * Usage:
 *   <TaekwondoQueueBoard rings={yourData} />
 * or use the built-in demo data.
 */

const demoData = [
  {
    ring: 1,
    matchNo: 12,
    status: "ONGOING",
    category: "Cadet -48kg",
    round: "Quarter Final",
    timeLeft: 65,
    timeTotal: 120,
    red: { name: "Rizky A.", club: "Garuda TC", score: 9 },
    blue: { name: "Fajar P.", club: "Harimau Dojang", score: 11 },
    next: {
      red: { name: "Bima Seto", club: "Rajawali" },
      blue: { name: "Dewa Kencana", club: "Singa Muda" },
      category: "Cadet -48kg",
    },
  },
  {
    ring: 2,
    matchNo: 13,
    status: "READY",
    category: "Junior -55kg",
    round: "Semi Final",
    timeLeft: 0,
    timeTotal: 0,
    red: { name: "Andi Pratama", club: "Cakra" },
    blue: { name: "Yoga Saputra", club: "Bima" },
    next: {
      red: { name: "Ardiansyah", club: "Garuda" },
      blue: { name: "Rauf", club: "Harimau" },
      category: "Junior -55kg",
    },
  },
  {
    ring: 3,
    matchNo: 14,
    status: "ONGOING",
    category: "Senior -63kg",
    round: "Round of 16",
    timeLeft: 35,
    timeTotal: 120,
    red: { name: "Satria N.", club: "Bhaskara", score: 5 },
    blue: { name: "Irfan K.", club: "Mahesa", score: 3 },
    next: {
      red: { name: "Agus", club: "Pusaka" },
      blue: { name: "Reza", club: "Nusantara" },
      category: "Senior -63kg",
    },
  },
  {
    ring: 4,
    matchNo: 15,
    status: "BREAK",
    category: "Cadet -44kg",
    round: "Break",
    timeLeft: 90,
    timeTotal: 180,
    red: { name: "—", club: "—", score: 0 },
    blue: { name: "—", club: "—", score: 0 },
    next: {
      red: { name: "Dimas", club: "Satria" },
      blue: { name: "Bayu", club: "Berlian" },
      category: "Cadet -44kg",
    },
  },
];

function RingStatus({ status }) {
  const tone = {
    ONGOING: { variant: "default", label: "Sedang Bertanding" },
    READY: { variant: "secondary", label: "Siap" },
    BREAK: { variant: "outline", label: "Istirahat" },
  }[status] || { variant: "secondary", label: status };

  return <Badge variant={tone.variant}>{tone.label}</Badge>;
}

function TimeBar({ left = 0, total = 0 }) {
  const value =
    total > 0
      ? Math.max(0, Math.min(100, Math.round(((total - left) / total) * 100)))
      : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs">
        <Timer className="h-3.5 w-3.5" />
        <span>{total ? `${left}s tersisa` : "—"}</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

function FighterRow({ corner = "red", fighter = {}, score }) {
  const side =
    corner === "red"
      ? "border-red-500/60 bg-red-500/5"
      : "border-blue-500/60 bg-blue-500/5";
  return (
    <div
      className={`flex items-center justify-between rounded-xl border ${side} px-3 py-2`}
    >
      <div className="flex items-center gap-2">
        <Sword className="h-4 w-4" />
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
  );
}

function NextMatch({ next }) {
  if (!next) return null;
  return (
    <div className="mt-3 text-sm">
      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
        <ChevronRight className="h-4 w-4" />
        <span>Berikutnya</span>
      </div>
      <div className="rounded-xl border bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <div className="font-medium">{next?.category || "—"}</div>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="text-xs">
            <div className="font-semibold">Merah</div>
            <div>{next?.red?.name}</div>
            <div className="text-muted-foreground">{next?.red?.club}</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold">Biru</div>
            <div>{next?.blue?.name}</div>
            <div className="text-muted-foreground">{next?.blue?.club}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RingCard({ data }) {
  const {
    ring,
    matchNo,
    status,
    category,
    round,
    timeLeft,
    timeTotal,
    red,
    blue,
    next,
  } = data;

  const headerTone = useMemo(() => {
    switch (status) {
      case "ONGOING":
        return "bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent";
      case "READY":
        return "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent";
      case "BREAK":
        return "bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent";
      default:
        return "";
    }
  }, [status]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="h-full overflow-hidden rounded-2xl shadow-sm">
        <CardHeader className={`p-4 ${headerTone}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge className="text-xs">Ring {ring}</Badge>
              <RingStatus status={status} />
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              aria-label="Notify"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
          <CardTitle className="mt-2 flex items-center gap-2 text-3xl font-extrabold">
            <Hash className="h-6 w-6" />
            {matchNo}
          </CardTitle>
          <div className="mt-1 text-base font-medium">
            {category}{" "}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              • {round}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <FighterRow corner="red" fighter={red} score={red?.score} />
          <FighterRow corner="blue" fighter={blue} score={blue?.score} />

          <Separator className="my-2" />
          <TimeBar left={timeLeft} total={timeTotal} />

          <NextMatch next={next} />
        </CardContent>
        <CardFooter className="p-4">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span>Terakhir diperbarui: {new Date().toLocaleTimeString()}</span>
            <span>Taekwondo Queue</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function TaekwondoQueueBoard({
  rings = demoData,
  title = "Antrian Pertandingan Taekwondo",
}) {
  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Tampilan publik untuk memantau antrian per ring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
            <Users className="mr-1 h-3.5 w-3.5" /> Penonton Mode
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rings.slice(0, 4).map((ring) => (
          <RingCard key={ring.ring} data={ring} />
        ))}
      </div>
    </div>
  );
}
