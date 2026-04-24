import { useEffect, useState } from "react"
import axios from "axios"

function UserDashboard() {
  const [events, setEvents] = useState([])
  const [user, setUser] = useState(null)

  const token = localStorage.getItem("token")

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token)
      setUser(decoded)
    }

    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await axios.get("http://127.0.0.1:8000/events")
    setEvents(res.data)
  }

  const bookEvent = async (id) => {
    await axios.post(
      `http://127.0.0.1:8000/book/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }
const [myBookings, setMyBookings] = useState([])

  const fetchMyBookings = async () => {
  const res = await axios.get("http://127.0.0.1:8000/book/my", {
    headers: { Authorization: `Bearer ${token}` },
  })
  setMyBookings(res.data)
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
      <p className="text-lg font-medium">{user?.sub}</p>
    </div>

    {/* Events */}
    <div>
      <h2 className="text-xl font-medium mb-4">Available Events</h2>

      <div className="space-y-4">
        {events.map((event) => (
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
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg text-sm font-medium"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
) 
}

export default UserDashboard