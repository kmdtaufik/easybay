import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/(auth)/login";
import Signup from "./pages/(auth)/signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
