import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Slider from "../components/slider"
import SiteFooter from "../components/siteFooter"

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true

    const loadEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/events/")

        if (!res.ok) {
          throw new Error("Unable to load events right now.")
        }

        const data = await res.json()

        if (isActive) {
          setEvents(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isActive) {
          setError(err.message || "Something went wrong while loading events.")
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-24 top-24 h-64 w-64 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute right-20 top-24 h-72 w-72 rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link
              to="/"
              className="text-sm font-medium uppercase tracking-[0.28em] text-white/75"
            >
              Event Horizon
            </Link>

            <Link
              to="/login"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/25 hover:text-white"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">
                Event booking
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Explore what is live right now.
              </h1>
            </div>

           
          </div>

          <Slider events={events} loading={loading} error={error} />

          <section className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-white/40">
                Minimal event booking
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Find and book events near you
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Concerts, movies, and live shows — all in one place. Choose your event and book instantly.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/0.03 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    Events
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                    {events.length}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/0.03 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    CATEGORIES  
                  </p>
                  <p className="mt-3 text-lg font-medium text-white">Movies 🍿 Concerts 🎊 Shows 🎭</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/0.03 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    BOOKING
                  </p>
                  <p className="mt-3 text-lg font-medium text-white">Instant confirmation</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                  YOUR EXPERINCE
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  Simple booking, no confusion.
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Select an event and confirm your booking in seconds. No more waiting in long lines or dealing with complicated booking processes.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                  TRUST ON US
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  Live availability
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  See real-time seat availability and pricing before you book.
                </p>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </div>
  )
}

export default Home
