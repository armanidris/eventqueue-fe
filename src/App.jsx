import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./app/Home";
import Antrian from "./app/Antrian";
import Tkd from "./app/TaekwonoQueue";
import Test from "./app/Test";
import Operator from "./app/Operator";
import AdminCourts from "./app/AdminCourts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/antrian" element={<Antrian />} />
      <Route path="/tkd" element={<Tkd />} />
      <Route path="/test" element={<Test />} />
      <Route path="/operator/:court" element={<Operator />} />
      <Route path="/adminCourts" element={<AdminCourts />} />
    </Routes>
  );
}

export default App;
