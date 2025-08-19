import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Clock,
  Flame,
  Medal,
  Search,
  Shuffle,
  CheckCircle2,
} from "lucide-react";

// --- Mock data --------------------------------------------------------------
const initialMatches = [
  {
    id: "M-101",
    court: "Lapangan 1",
    category: "Junior -57kg",
    round: "Perempat Final",
    red: { name: "Ayu Pratiwi", club: "Garuda TKD" },
    blue: { name: "Nadia Putri", club: "Rajawali Dojang" },
    status: "ongoing",
    eta: "02:15",
  },
  {
    id: "M-102",
    court: "Lapangan 2",
    category: "Senior -68kg",
    round: "Penyisihan",
    red: { name: "Bima Saputra", club: "Harimau TKD" },
    blue: { name: "Rizky Kurniawan", club: "Nusantara TKD" },
    status: "next",
    eta: "05:00",
  },
  {
    id: "M-103",
    court: "Lapangan 3",
    category: "Cadet -41kg",
    round: "Penyisihan",
    red: { name: "Dewi Anggraini", club: "Merpati TKD" },
    blue: { name: "Salsa Ramadhani", club: "Satria TKD" },
    status: "queued",
    eta: "10:00",
  },
  {
    id: "M-104",
    court: "Lapangan 4",
    category: "Junior -63kg",
    round: "Penyisihan",
    red: { name: "Fajar Hidayat", club: "Maha TKD" },
    blue: { name: "Irfan Nugroho", club: "Sakura TKD" },
    status: "queued",
    eta: "15:00",
  },
  {
    id: "M-105",
    court: "Lapangan 1",
    category: "Senior -80kg",
    round: "Penyisihan",
    red: { name: "Rangga Aditya", club: "Garuda TKD" },
    blue: { name: "Yoga Pranata", club: "Rajawali Dojang" },
    status: "queued",
    eta: "20:00",
  },
];

// --- Helper UI -------------------------------------------------------------
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

const MatchCard = ({ m, onComplete }) => {
  return (
    <motion.div
      layout
      layoutId={m.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-muted-foreground/60" />
              {m.court}
            </CardTitle>
            <StatusBadge status={m.status} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {m.category} • {m.round}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{m.red.name}</span>
                <span className="text-xs text-muted-foreground">
                  {m.red.club}
                </span>
              </div>
              <Badge className="rounded-xl">RED</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{m.blue.name}</span>
                <span className="text-xs text-muted-foreground">
                  {m.blue.club}
                </span>
              </div>
              <Badge variant="secondary" className="rounded-xl">
                BLUE
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" /> ETA {m.eta}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="gap-1">
              Detail <ChevronRight className="h-4 w-4" />
            </Button>
            {m.status !== "done" && (
              <Button
                size="sm"
                variant="default"
                className="gap-1"
                onClick={() => onComplete?.(m.id)}
              >
                <CheckCircle2 className="h-4 w-4" /> Selesai
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function TaekwondoQueue() {
  const [matches, setMatches] = useState(initialMatches);
  const [query, setQuery] = useState("");
  const [filterCourt, setFilterCourt] = useState("all");
  const [sortBy, setSortBy] = useState("status");

  const courts = useMemo(
    () => Array.from(new Set(matches.map((m) => m.court))),
    [matches]
  );

  const visible = useMemo(() => {
    let data = matches.filter((m) => {
      const q = query.trim().toLowerCase();
      const hit = q
        ? [
            m.id,
            m.court,
            m.category,
            m.round,
            m.red.name,
            m.red.club,
            m.blue.name,
            m.blue.club,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;
      const courtOk = filterCourt === "all" ? true : m.court === filterCourt;
      return hit && courtOk;
    });

    if (sortBy === "status") {
      const order = { ongoing: 0, next: 1, queued: 2, done: 3 };
      data = data.sort(
        (a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9)
      );
    } else if (sortBy === "eta") {
      const toSec = (mmss) => {
        const [m, s] = mmss.split(":").map(Number);
        return m * 60 + s;
      };
      data = data.sort((a, b) => toSec(a.eta) - toSec(b.eta));
    }

    return data;
  }, [matches, query, filterCourt, sortBy]);

  const completeMatch = (id) => {
    setMatches((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, status: "done", eta: "00:00" } : m
      );
      // Promote the earliest non-done to fill states nicely
      const hasOngoing = updated.some((m) => m.status === "ongoing");
      if (!hasOngoing) {
        const idx = updated.findIndex((m) => m.status === "next");
        if (idx !== -1) updated[idx] = { ...updated[idx], status: "ongoing" };
      }
      const nextIdx = updated.findIndex((m) => m.status === "queued");
      if (nextIdx !== -1 && !updated.some((m) => m.status === "next")) {
        updated[nextIdx] = { ...updated[nextIdx], status: "next" };
      }
      return [...updated];
    });
  };

  const shuffleQueue = () => {
    setMatches((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  Antrian Pertandingan Taekwondo
                </h1>
                <p className="text-xs text-muted-foreground">
                  Tampilan responsif berbasis card • 4 kolom di layar lebar
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari atlet / klub / kategori"
                  className="pl-8"
                />
              </div>

              <Select value={filterCourt} onValueChange={setFilterCourt}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Lapangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Lapangan</SelectItem>
                  {courts.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="eta">ETA</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="secondary"
                onClick={shuffleQueue}
                className="gap-1"
              >
                <Shuffle className="h-4 w-4" /> Acak
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <LayoutGroup>
          <AnimatePresence>
            <motion.div
              layout
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            >
              {visible.map((m) => (
                <MatchCard key={m.id} m={m} onComplete={completeMatch} />
              ))}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} QueueTKD</span>
          <span className="flex items-center gap-1">
            <Medal className="h-3.5 w-3.5" /> shadcn • Tailwind • React
          </span>
        </div>
      </footer>
    </div>
  );
}
