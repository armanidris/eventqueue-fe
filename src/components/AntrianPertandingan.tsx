import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function TaekwondoQueueBoard({ courts }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header / Judul Aplikasi */}
      <header className="py-6 bg-white shadow-md border-b">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 tracking-wide">
          Unhas CUP 2025
        </h1>
      </header>

      {/* Konten utama */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {courts.map((court) => (
            <motion.div
              key={court.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-2xl shadow-xl overflow-hidden border-2 border-gray-400">
                {/* Header Lapangan */}
                {/* <CardHeader className="border-b-2 border-gray-400"> */}
                  <CardTitle className="text-2xl font-bold text-center text-black">
                    {court.name}
                  </CardTitle>
                {/* </CardHeader> */}

                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <AnimatePresence mode="popLayout">
                      {[
                        {
                          label: "Bertanding",
                          value: court.current,
                          bg: "bg-red-100",
                          border: "border-red-400",
                        },
                        {
                          label: "Bersiap",
                          value: court.next,
                          bg: "bg-yellow-100",
                          border: "border-yellow-400",
                        },
                        {
                          label: "Segera",
                          value: court.afterNext,
                          bg: court.afterNext ? "bg-green-100" : "bg-gray-100",
                          border: court.afterNext
                            ? "border-green-400"
                            : "border-gray-400",
                        },
                      ].map((item) => (
                        <motion.div
                          key={`${court.name}-${item.label}-${item.value ?? "none"}`}
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -50 }}
                          transition={{ duration: 0.5 }}
                          className={`p-6 ${item.bg} border ${item.border} rounded-xl shadow-sm text-center`}
                        >
                          <h2
                            className={`${
                              item.label === "Bertanding"
                                ? "text-6xl font-extrabold"
                                : item.label === "Persiapan"
                                ? "text-5xl font-bold"
                                : "text-4xl font-bold"
                            } text-black`}
                          >
                            {item.value ?? "-"}
                          </h2>
                          <p className="text-sm uppercase tracking-wide font-semibold text-gray-700">
                            {item.label}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 bg-white border-t text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2">
          <img className="w-6 h-6" src="sportygeek.png" alt="sportygeek" />
          <span className="font-semibold">sportygeek</span>
        </div>
      </footer>
    </div>
  );
}

// Contoh data
const sampleCourts = [
  { name: "Lapangan A", current: 12, next: 13, afterNext: 14 },
  { name: "Lapangan B", current: 21, next: 22, afterNext: 23 },
  { name: "Lapangan C", current: 31, next: 32, afterNext: 33 },
  { name: "Lapangan D", current: 41, next: 42, afterNext: null },
];

// Cara pakai:
// <TaekwondoQueueBoard courts={sampleCourts} />
