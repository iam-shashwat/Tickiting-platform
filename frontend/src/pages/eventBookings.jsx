import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import SiteFooter from "../components/siteFooter"

function EventBookings() {
  const { id } = useParams()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }

    let isActive = true

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/book/event/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (isActive) {
          setBookings(res.data)
        }
      } catch (err) {
        console.error("EVENT BOOKINGS ERROR:", err)
        if (isActive) {
          setError("Unable to load event bookings right now.")
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    fetchBookings()

    return () => {
      isActive = false
    }
  }, [id, navigate, token])

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-5rem] h-64 w-64 rounded-full bg-white/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
              Event bookings
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Booking list
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Review everyone booked for event #{id}.
            </p>
          </div>

          <Link
            to="/admin"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/25 hover:text-white"
          >
            Back to admin
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="h-5 w-1/3 rounded-full bg-white/8" />
                <div className="mt-3 h-4 w-1/2 rounded-full bg-white/8" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-lg font-medium text-white">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-lg font-medium text-white">No bookings yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              This event does not have any bookings right now.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={booking.booking_id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                  Booking {index + 1}
                </p>
                <p className="mt-4 text-lg font-medium text-white">
                  {booking.email}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  User ID: {booking.user_id}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  )
}

export default EventBookings
