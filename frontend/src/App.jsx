import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/login"
import Dashboard from "./pages/dashboard"
import Register from "./pages/register"
import Admin from "./pages/dashboardAdmin"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App