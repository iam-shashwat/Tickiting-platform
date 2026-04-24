import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return

    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await res.json()


      console.log("LOGIN RESPONSE:", data)

      if (data.access_token) {
  localStorage.setItem("token", data.access_token)

  // fetch user details (includes role)
  const meRes = await fetch("http://127.0.0.1:8000/users/me", {
    headers: {
      Authorization: `Bearer ${data.access_token}`
    }
  })

  const user = await meRes.json()

  console.log("USER DATA:", user)
  
  localStorage.setItem("role", user.role)

  // role-based redirect
  if (user.role === "admin") {
    navigate("/admin")
  } else {
    navigate("/dashboard")
  }
} else {
        alert("Invalid credentials")
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={(e) => {
        e.preventDefault()
        handleLogin()
       }}
      className="w-95 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        
        <h1 className="text-2xl font-semibold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-zinc-400 mb-6 text-sm">
          Login to access your dashboard
        </p>

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
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-zinc-400 text-sm mt-4 text-center">
            Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-white cursor-pointer hover:underline"
          >
               Register
         </span>
        </p>
      </form>
    </div>
  )
}