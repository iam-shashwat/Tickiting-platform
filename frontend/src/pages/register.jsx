import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!name || !email || !password) return

    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      })

      const data = await res.json()

      console.log("REGISTER RESPONSE:", data)

      if (res.ok) {
        navigate("/")
      } else {
        alert(data.detail || "Registration failed")
      }

    } catch (err) {
      console.error("REGISTER ERROR:", err)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-95 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        
        <h1 className="text-2xl font-semibold text-white mb-2">
          Create Account
        </h1>

        <p className="text-zinc-400 mb-6 text-sm">
          Register to get started
        </p>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white transition"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-white transition"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>

      </div>
    </div>
  )
}