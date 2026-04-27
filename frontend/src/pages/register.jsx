import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SiteFooter from "../components/siteFooter"

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
        navigate("/login")
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
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-5rem top-4rem h-56 w-56 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute bottom-5rem right-5rem h-64 w-64 rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-6xl px-6 py-5">
          <Link
            to="/"
            className="text-sm font-medium uppercase tracking-[0.28em] text-white/75"
          >
            Event Horizon
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-6 pb-12">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleRegister()
            }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0c1017] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
              Register
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Create your account
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Set up a new account to manage bookings in the dark minimal flow.
            </p>

            <div className="mt-8">
              <label className="mb-2 block text-sm text-white/60">Name</label>
              <input
                type="text"
                value={name}
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-white outline-none transition focus:border-white/30"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-white/60">Email</label>
              <input
                type="email"
                value={email}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-white outline-none transition focus:border-white/30"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-white/60">
                Password
              </label>
              <input
                type="password"
                value={password}
                placeholder="Create a password"
                className="w-full rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-white outline-none transition focus:border-white/30"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading || !name || !email || !password}
              type="submit"
              className="mt-8 w-full rounded-2xl bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Register"}
            </button>

            <p className="mt-5 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-white transition hover:text-zinc-300"
              >
                Login
              </button>
            </p>
          </form>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}
