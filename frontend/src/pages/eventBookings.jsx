import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

function EventBookings() {
  const { id } = useParams()
  const [bookings, setBookings] = useState([])

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/book/event/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    setBookings(res.data)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl mb-6">Event Bookings</h1>

      <div className="space-y-3">
        {bookings.map((b) => (
          <div
            key={b.booking_id}
            className="bg-neutral-900 border border-neutral-800 p-4 rounded"
          >
            <p className="text-sm text-neutral-400">User</p>
            <p className="text-lg">{b.email}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventBookings