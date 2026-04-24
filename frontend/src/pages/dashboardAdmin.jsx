import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Admin() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const navigate = useNavigate()

  // AUTH + ROLE CHECK
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
    }

    const fetchUser = async () => {
      const res = await fetch("http://127.0.0.1:8000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!data || data.role !== "admin") {
        localStorage.removeItem("token")
        navigate("/")
        return
      }

      setUser(data)
    }

    fetchUser()
  }, [])

  // FETCH EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch("http://127.0.0.1:8000/events/")
      const data = await res.json()
      setEvents(data)
    }

    fetchEvents()
  }, [])

  // CREATE EVENT
  const createEvent = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch("http://127.0.0.1:8000/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.detail || "Error creating event")
      return
    }

    setEvents([...events, data])
    setTitle("")
    setDescription("")
  }

  // DELETE EVENT
  const deleteEvent = async (id) => {
    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:8000/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setEvents(events.filter(e => e.id !== id))
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm">
            {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* CREATE EVENT CARD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Create Event</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="w-full mb-3 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none focus:border-white"
          />

          <button
            onClick={createEvent}
            className="px-5 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
          >
            Create
          </button>
        </div>

        {/* EVENTS LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">All Events</h2>

          <div className="space-y-4">
            {events.map((e) => (
              <div
                key={e.id}
                onClick={() => navigate(`/admin/event/${e.id}`)}
                className="flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-xl p-4 cursor-pointer hover:border-white transition"
              >
                <div>
                  <h3 className="font-medium">{e.title}</h3>
                  <p className="text-sm text-zinc-400">{e.description}</p>
                </div>

                <button
                  onClick={(ev) => {
                    ev.stopPropagation()
                    deleteEvent(e.id)
                  }}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}