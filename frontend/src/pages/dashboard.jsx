import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import SiteFooter from "../components/siteFooter"
import { getEventCardStyle } from "../lib/utils"

function UserDashboard() {
  const [events, setEvents] = useState([])
  const [userDetails, setUserDetails] = useState(null)
  const [myBookings, setMyBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const bookEvent = async (id) => {
    if (myBookings.includes(id)) return

    try {
      await axios.post(
        `http://127.0.0.1:8000/book/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMyBookings((prev) => [...prev, id])
    } catch (err) {
      console.error("BOOKING ERROR:", err)
      alert("Unable to complete booking right now.")
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    let isActive = true

    const loadDashboard = async () => {
      try {
        const [eventsRes, userRes, bookingsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/events/"),
          axios.get("http://127.0.0.1:8000/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/book/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!isActive) return

        setEvents(eventsRes.data)
        setUserDetails(userRes.data)
        setMyBookings(bookingsRes.data.map((booking) => booking.event_id))
      } catch (err) {
        console.error("DASHBOARD LOAD ERROR:", err)
        if (isActive) {
          setError("Unable to load your dashboard right now.")
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isActive = false
    }
  }, [navigate, token])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-5rem] h-64 w-64 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute right-[-6rem] bottom-[-5rem] h-72 w-72 rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
              User dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {userDetails?.name ? `Hi, ${userDetails.name}` : "Your bookings"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {userDetails?.email || "Manage your bookings and available events."}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/25 hover:text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-white/35">
              My bookings
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {myBookings.length}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-white/35">
              Available events
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
              {events.length}
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
              Events
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Available to book
            </h2>
          </div>

          {loading ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="h-5 w-2/3 rounded-full bg-white/8" />
                  <div className="mt-4 h-4 w-full rounded-full bg-white/8" />
                  <div className="mt-2 h-4 w-5/6 rounded-full bg-white/8" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-lg font-medium text-white">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-lg font-medium text-white">No events found</p>
              <p className="mt-2 text-sm text-zinc-400">
                New events will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {events.map((event) => {
                const isBooked = myBookings.includes(event.id)

                return (
                  <article
                    key={event.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                  >
                    <div
                      className="relative h-48 border-b border-white/10"
                      style={getEventCardStyle(event.image_url)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-transparent" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
                        Event
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight text-white">
                            {event.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-zinc-400">
                            {event.description}
                          </p>
                        </div>

                        <button
                          onClick={() => bookEvent(event.id)}
                          disabled={isBooked}
                          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                            isBooked
                              ? "border border-white/10 bg-white/5 text-white/45"
                              : "bg-white text-black hover:bg-zinc-200"
                          }`}
                        >
                          {isBooked ? "Booked" : "Book"}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}

export default UserDashboard
