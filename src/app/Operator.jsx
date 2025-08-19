import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function Operator() {
  const [courtData, setCourtData] = useState({
    id: null,
    current: null,
    next: null,
    afterNext: null,
    Last: null,
  });
  const [nextInput, setNextInput] = useState("");
  const [afterNextInput, setAfterNextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { court } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch data dari backend
  const fetchCourtData = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/courts/${encodeURIComponent(court)}`
      );
      const data = await res.json();
      setCourtData(data);
      setNextInput(data.next?.toString() || "");
      setAfterNextInput(data.afterNext?.toString() || "");
    } catch (err) {
      console.error("Error fetching court data:", err);
    }
  };

  useEffect(() => {
    fetchCourtData();
  }, [court]);

  // Tandai partai selesai
  const handleFinish = async () => {
    if (!courtData.current) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}/api/courts/${courtData.id}/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      await fetchCourtData();
    } catch (err) {
      console.error("Error finishing match:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update partai berikutnya dan setelahnya
  const handleUpdateNextMatches = async () => {
    if (!courtData.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/courts/${courtData.id}/update-next`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            next: parseInt(nextInput),
            afterNext: parseInt(afterNextInput),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update matches");
      }

      await fetchCourtData();
      setEditMode(false);
    } catch (err) {
      console.error("Error updating next matches:", err);
    } finally {
      setLoading(false);
    }
  };

  // Validasi input
  const validateInput = (value) => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0 && num <= courtData.Last;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Operator {court}</h1>

      <Card className="w-full max-w-md border-2 border-gray-300 shadow-lg rounded-2xl">
        <CardHeader className="bg-red-200 rounded-t-2xl">
          <CardTitle className="text-center text-4xl font-extrabold text-black">
            {courtData.current
              ? `Partai ${courtData.current}`
              : "Tidak ada Partai"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-semibold">Berikutnya:</p>
            {editMode ? (
              <Input
                type="number"
                min="1"
                max={courtData.Last}
                value={nextInput}
                onChange={(e) => setNextInput(e.target.value)}
                disabled={loading}
                className="text-center"
              />
            ) : (
              <p className="font-bold">
                {courtData.next ? `Partai ${courtData.next}` : "-"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">Setelahnya:</p>
            {editMode ? (
              <Input
                type="number"
                min="1"
                max={courtData.Last}
                value={afterNextInput}
                onChange={(e) => setAfterNextInput(e.target.value)}
                disabled={loading}
                className="text-center"
              />
            ) : (
              <p className="font-bold">
                {courtData.afterNext ? `Partai ${courtData.afterNext}` : "-"}
              </p>
            )}
          </div>

          {editMode ? (
            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
                onClick={handleUpdateNextMatches}
                disabled={
                  loading ||
                  !validateInput(nextInput) ||
                  !validateInput(afterNextInput) ||
                  (parseInt(nextInput) === courtData.next &&
                    parseInt(afterNextInput) === courtData.afterNext)
                }
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition"
                onClick={() => {
                  setEditMode(false);
                  setNextInput(courtData.next?.toString() || "");
                  setAfterNextInput(courtData.afterNext?.toString() || "");
                }}
                disabled={loading}
              >
                Batal
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition"
                onClick={handleFinish}
                disabled={loading || !courtData.current}
              >
                {loading ? "Memproses..." : "Selesai"}
              </Button>
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                onClick={() => setEditMode(true)}
                disabled={loading}
              >
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
