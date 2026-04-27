import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import SiteFooter from "../components/siteFooter"
import { formatEventPrice, getEventCardStyle } from "../lib/utils"

async function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("Failed to read image"))

    reader.readAsDataURL(file)
  })
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("0")
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const imageInputRef = useRef(null)
  const parsedPrice = Number.parseFloat(price)
  const isPriceInvalid =
    price.trim() === "" || Number.isNaN(parsedPrice) || parsedPrice < 0

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview("")
      return
    }

    const previewUrl = URL.createObjectURL(selectedImage)
    setImagePreview(previewUrl)

    return () => {
      URL.revokeObjectURL(previewUrl)
    }
  }, [selectedImage])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    let isActive = true

    const loadAdmin = async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch("http://127.0.0.1:8000/events/"),
        ])

        const userData = await userRes.json()
        const eventsData = await eventsRes.json()

        if (!isActive) return

        if (!userData || userData.role !== "admin") {
          localStorage.removeItem("token")
          localStorage.removeItem("role")
          navigate("/login")
          return
        }

        setUser(userData)
        setEvents(eventsData)
      } catch (err) {
        console.error("ADMIN LOAD ERROR:", err)
        if (isActive) {
          setError("Unable to load the admin dashboard right now.")
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadAdmin()

    return () => {
      isActive = false
    }
  }, [navigate])

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null

    if (file && !file.type.startsWith("image/")) {
      alert("Please choose an image file.")
      event.target.value = ""
      return
    }

    setSelectedImage(file)
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ""
    }
  }

  const createEvent = async () => {
    if (!title.trim() || !description.trim() || isPriceInvalid) {
      if (isPriceInvalid) {
        alert("Please enter a valid ticket price.")
      }

      return
    }

    const token = localStorage.getItem("token")
    setSaving(true)

    try {
      const imageData = selectedImage
        ? await readFileAsDataUrl(selectedImage)
        : null

      const res = await fetch("http://127.0.0.1:8000/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: parsedPrice,
          image_data: imageData,
          image_name: selectedImage?.name || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.detail || "Error creating event")
        return
      }

      setEvents((current) => [data, ...current])
      setTitle("")
      setDescription("")
      setPrice("0")
      setSelectedImage(null)

      if (imageInputRef.current) {
        imageInputRef.current.value = ""
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteEvent = async (id) => {
    const token = localStorage.getItem("token")

    await fetch(`http://127.0.0.1:8000/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setEvents((current) => current.filter((event) => event.id !== id))
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/")
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-24 top-20 h-64 w-64 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute bottom-20 right-24 h-72 w-72 rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
              Admin
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
              Event management
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {user?.email || "Create events and review bookings from one place."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/25 hover:text-white"
            >
              Home
            </Link>
            <button
              onClick={logout}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/25 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/0.03 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/40">
              Create event
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
              Add a new listing
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Keep it short, clear, and ready for the home feed.
            </p>

            <div className="mt-8">
              <label className="mb-2 block text-sm text-white/60">
                Event title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add your event Title here"
                className="w-full rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-white outline-none transition focus:border-white/30"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-white/60">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Short event description"
                className="w-full rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-white outline-none transition focus:border-white/30"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-white/60">
                Ticket price
              </label>
              <input
                type="text"
                inputMode="numeric"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter your Amount in INR"
                className="w-full rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-white outline-none transition focus:border-white/30"
              />
              {isPriceInvalid && price.trim() !== "" && (
                <p className="mt-2 text-xs text-red-400">
                  ❌ Invalid input - Please enter numbers only, no letters or special characters.
                </p>
              )}
              {!isPriceInvalid && price.trim() !== "" && (
                <p className="mt-2 text-xs text-zinc-500">
                  ✓ Public pages will show {formatEventPrice(parsedPrice)}.
                </p>
              )}
              {price.trim() === "" && (
                <p className="mt-2 text-xs text-zinc-500">
                  Use 0 for a free event.
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-white/60">
                Event image
              </label>
              <div className="flex gap-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/0.03 px-4 py-3 text-sm text-white outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-zinc-200 focus:border-white/30"
                />
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="shrink-0 rounded-lg border border-red-500/50 bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/20 hover:border-red-500/70"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Upload a JPG, PNG, WEBP, or GIF from your device. Max 5MB.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/0.03">
              <div
                className="relative h-40"
                style={getEventCardStyle(imagePreview)}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.1)_0%,rgba(5,7,13,0.88)_100%)]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
                  Preview
                </div>
                <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                  {formatEventPrice(parsedPrice)}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-lg font-semibold text-white">
                    {title.trim() || "Event title preview"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={createEvent}
                disabled={saving || !title.trim() || !description.trim() || isPriceInvalid}
                className="mt-6 flex-1 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create event"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/0.03 p-6">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/40">
                  Events
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                  All listings
                </h2>
              </div>
              {!loading && !error ? (
                <p className="text-sm text-zinc-500">
                  {events.length} {events.length === 1 ? "event" : "events"}
                </p>
              ) : null}
            </div>

            {loading ? (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-white/10 bg-white/0.03 p-5"
                  >
                    <div className="h-5 w-2/3 rounded-full bg-white/8" />
                    <div className="mt-3 h-4 w-full rounded-full bg-white/8" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/0.03 p-6">
                <p className="text-lg font-medium text-white">{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/0.03 p-6">
                <p className="text-lg font-medium text-white">No events yet</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Create an event and it will show up here immediately.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {events.map((event) => (
                  <article
                    key={event.id}
                    onClick={() => navigate(`/admin/event/${event.id}`)}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/0.03 transition hover:border-white/20"
                  >
                    <div
                      className="relative h-44 border-b border-white/10"
                      style={getEventCardStyle(event.image_url)}
                    >
                      <div className="absolute inset-0 linear-gradient-to-t from-[#05070d] via-transparent to-transparent" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
                        Event
                      </div>
                      <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                        {formatEventPrice(event.price)}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold tracking-tight text-white">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {event.description}
                      </p>
                      <p className="mt-4 text-sm font-medium text-white/85">
                        Ticket price: {formatEventPrice(event.price)}
                      </p>

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60">
                          Open bookings
                        </span>
                        <button
                          onClick={(ev) => {
                            ev.stopPropagation()
                            deleteEvent(event.id)
                          }}
                          className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
