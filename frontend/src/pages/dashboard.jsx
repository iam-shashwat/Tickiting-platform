import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMe, getEvents } from "../api/api"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/")
      return
    }

    const fetchUser = async () => {
      const data = await getMe()

      if (data.detail) {
        localStorage.removeItem("token")
        navigate("/")
        return
      }

      setUser(data)

      const eventsData = await getEvents()
      setEvents(Array.isArray(eventsData) ? eventsData : [])
    }

    fetchUser()
  }, [navigate])

  const fetchEvents = async () => {
    const data = await getEvents()
    setEvents(Array.isArray(data) ? data : [])
  }

  // CREATE EVENT
  const createEvent = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:8000/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    })

    if (!res.ok) {
      console.log("CREATE ERROR:", await res.text())
      return
    }

    const data = await res.json()
    console.log("CREATED:", data)

    setTitle("")
    setDescription("")

    fetchEvents()
  }

  // DELETE EVENT
  const deleteEvent = async (id) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`http://127.0.0.1:8000/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      console.log("DELETE ERROR:", await res.text())
      return
    }

    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  // BOOK EVENT
  const bookEvent = async (id) => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:8000/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ event_id: id }),
    })

    if (!res.ok) {
      console.log("BOOK ERROR:", await res.text())
      return
    }

    const data = await res.json()
    console.log("BOOKED:", data)
  }

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition backdrop-blur"
        >
          Logout
        </button>
      </div>

      {/* USER */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* CREATE */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-lg font-medium mb-4">Create Event</h2>

          <div className="flex gap-3">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-[#111] border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20"
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-[#111] border border-white/10 px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-white/20"
            />

            <button
              onClick={createEvent}
              className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90 transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* EVENTS */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-medium mb-4">Events</h2>

        <div className="space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/[0.07] transition"
            >
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-gray-400 mt-1">{e.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => bookEvent(e.id)}
                  className="px-4 py-1.5 rounded-md bg-green-500/90 hover:bg-green-500 text-sm"
                >
                  Book
                </button>

                <button
                  onClick={() => deleteEvent(e.id)}
                  className="px-4 py-1.5 rounded-md bg-red-500/90 hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
