import { useEffect, useState } from "react"
import axios from "axios"


function UserDashboard() {
  const [events, setEvents] = useState([])
  const [userDetails, setUserDetails] = useState(null)
  const [myBookings, setMyBookings] = useState([])

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      fetchUserDetails()
      fetchMyBookings()
    }

    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await axios.get("http://127.0.0.1:8000/events")
    setEvents(res.data)
  }

  const fetchUserDetails = async () => {
    const res = await axios.get("http://127.0.0.1:8000/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
    setUserDetails(res.data)
  }

  const fetchMyBookings = async () => {
    const res = await axios.get("http://127.0.0.1:8000/book/my", {
      headers: { Authorization: `Bearer ${token}` },
    })

    const bookedIds = res.data.map((b) => b.event_id)
    setMyBookings(bookedIds)
  }

  const bookEvent = async (id) => {
    if (myBookings.includes(id)) return

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
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/"
          }}
          className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-8">
        <p className="text-sm text-neutral-400">Logged in as</p>
        <p className="text-lg font-medium">
          {userDetails?.name }
        </p>
      </div>

      {/* Events */}
      <div>
        <h2 className="text-xl font-medium mb-4">Available Events</h2>

        <div className="space-y-4">
          {events.map((event) => {
            const isBooked = myBookings.includes(event.id)

            return (
              <div
                key={event.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex justify-between items-center hover:border-neutral-700 transition"
              >
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-neutral-400">
                    {event.description}
                  </p>
                </div>

                <button
                  onClick={() => bookEvent(event.id)}
                  disabled={isBooked}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    isBooked
                      ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                >
                  {isBooked ? "Booked" : "Book"}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard