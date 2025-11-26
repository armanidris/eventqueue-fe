import { useEffect, useState } from "react";
import AntrianPertandingan from "@/components/AntrianPertandingan";

function Antrian() {
  const [courts, setCourts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [lastUpdate, setLastUpdate] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch initial data
  const fetchCourts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courts`);
      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setCourts(data);
      setConnectionStatus("connected");
    } catch (err) {
      console.error("Error fetching courts:", err);
      setConnectionStatus("disconnected");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCourts();

    // Setup SSE connection
    const sseUrl = `${API_URL}/api/sse/courts`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener("initial_data", (e) => {
      try {
        const data = JSON.parse(e.data);
        setCourts(data.data);
        setLastUpdate(new Date(data.timestamp));
        setConnectionStatus("connected");
      } catch (err) {
        console.error("Error parsing initial data:", err);
      }
    });

    eventSource.addEventListener("court_update", (e) => {
      try {
        const { data: eventData } = JSON.parse(e.data);
        setCourts((prev) =>
          prev.map((court) =>
            court.id === eventData.id ? { ...court, ...eventData } : court
          )
        );
        setLastUpdate(new Date(eventData.timestamp));
        setConnectionStatus("connected");
      } catch (err) {
        console.error("Error processing update:", err);
      }
    });

    eventSource.onerror = () => {
      setConnectionStatus("reconnecting");
      eventSource.close();

      // Attempt reconnect after delay
      setTimeout(() => {
        fetchCourts();
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      fetchCourts();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  const connectionStatusMessages = {
    connecting: "Menghubungkan ke server...",
    connected: "Terhubung real-time",
    disconnected: "Koneksi terputus, menggunakan data offline",
    reconnecting: "Mencoba menyambung kembali...",
  };

  return (
    <div className="antrian-container">
      <AntrianPertandingan
        courts={courts}
        onCourtUpdate={fetchCourts} // Fallback jika SSE tidak bekerja
      />
      <div className={`connection-status ${connectionStatus}`}>
        {connectionStatusMessages[connectionStatus]}
        {lastUpdate && (
          <span className="last-update">
            Terakhir diperbarui: {new Date(lastUpdate).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default Antrian;
