import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    current: "",
    next: "",
    afterNext: "",
    Last: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  console.log(API_URL);

  // Fetch data courts
  const fetchCourts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courts`);
      const data = await res.json();
      setCourts(data);
    } catch (err) {
      console.error("Error fetching courts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  // Mulai edit
  const startEdit = (court) => {
    setEditingId(court.id);
    setFormData({
      name: court.name,
      current: court.current?.toString() || "",
      next: court.next?.toString() || "",
      afterNext: court.afterNext?.toString() || "",
      Last: court.Last?.toString() || "",
    });
  };

  // Batalkan edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      current: "",
      next: "",
      afterNext: "",
      Last: "",
    });
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simpan perubahan
  const saveChanges = async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/courts/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          current: formData.current ? parseInt(formData.current) : null,
          next: formData.next ? parseInt(formData.next) : null,
          afterNext: formData.afterNext ? parseInt(formData.afterNext) : null,
          Last: parseInt(formData.Last),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update court");
      }

      await fetchCourts();
      cancelEdit();
    } catch (err) {
      console.error("Error updating court:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset lapangan
  const resetCourt = async (courtId) => {
    if (
      !confirm("Reset lapangan ini? Partai saat ini akan dikembalikan ke 1")
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/courts/${courtId}/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reset court");
      }

      await fetchCourts();
    } catch (err) {
      console.error("Error resetting court:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin - Pengaturan Lapangan</h1>

      {loading && courts.length === 0 ? (
        <p>Memuat data...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Nama Lapangan</TableHead>
                <TableHead>Partai Saat Ini</TableHead>
                <TableHead>Berikutnya</TableHead>
                <TableHead>Setelahnya</TableHead>
                <TableHead>Total Partai</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courts.map((court) => (
                <TableRow key={court.id}>
                  {editingId === court.id ? (
                    <>
                      <TableCell>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="current"
                          type="number"
                          min="1"
                          value={formData.current}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="next"
                          type="number"
                          min="1"
                          value={formData.next}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="afterNext"
                          type="number"
                          min="1"
                          value={formData.afterNext}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="Last"
                          type="number"
                          min="1"
                          value={formData.Last}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          onClick={saveChanges}
                          disabled={loading}
                        >
                          Simpan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={loading}
                        >
                          Batal
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">
                        {court.name}
                      </TableCell>
                      <TableCell>{court.current || "-"}</TableCell>
                      <TableCell>{court.next || "-"}</TableCell>
                      <TableCell>{court.afterNext || "-"}</TableCell>
                      <TableCell>{court.Last}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() => startEdit(court)}
                          disabled={loading}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => resetCourt(court.id)}
                          disabled={loading}
                        >
                          Reset
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
