import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Register from "./pages/register"
import Admin from "./pages/dashboardAdmin"
import EventBookings from "./pages/eventBookings"
import Home from "./pages/home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/event/:id" element={<EventBookings />} />
        <Route path="/events/:id" element={<div>Event Detail Page</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
