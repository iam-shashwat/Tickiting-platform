import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Register from "./pages/register"
import Admin from "./pages/dashboardAdmin"
import EventBookings from "./pages/EventBookings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/event/:id" element={<EventBookings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App