import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SiteFooter from "../components/siteFooter"
import { getEventCardStyle } from "../lib/utils"

function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)

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

  const slides = [...events].sort((left, right) => right.id - left.id)
  const activeIndex = slides.length === 0 ? 0 : currentSlide % slides.length
  const activeSlide = slides[activeIndex] || null

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCurrentSlide((previousSlide) =>
        previousSlide === slides.length - 1 ? 0 : previousSlide + 1
      )
    }, 5000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [slides.length])

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const goToPreviousSlide = () => {
    if (slides.length === 0) return

    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? slides.length - 1 : previousSlide - 1
    )
  }

  const goToNextSlide = () => {
    if (slides.length === 0) return

    setCurrentSlide((previousSlide) =>
      previousSlide === slides.length - 1 ? 0 : previousSlide + 1
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-6rem top-6rem h-64 w-64 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute right-5rem top-24 h-72 w-72 rounded-full bg-white/4 blur-3xl" />
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

          {loading ? (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/0.03 p-4">
              <div className="h-28rem rounded-[1.5rem] bg-white/0.04 sm:h-34rem lg:h-42rem" />
              <div className="mt-4 h-7 w-1/3 rounded-full bg-white/8" />
              <div className="mt-3 h-4 w-full rounded-full bg-white/8" />
              <div className="mt-2 h-4 w-5/6 rounded-full bg-white/8" />
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
              <p className="text-lg font-medium text-white">
                Events could not be loaded.
              </p>
              <p className="mt-2 text-sm text-zinc-400">{error}</p>
            </div>
          ) : !activeSlide ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
              <p className="text-lg font-medium text-white">No events yet</p>
              <p className="mt-2 text-sm text-zinc-400">
                Create events from the admin dashboard and they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/0.03 p-4">
              <div className="mb-4 flex items-end justify-between gap-4 px-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    Events
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    Browse listings
                  </h2>
                </div>

                {slides.length > 1 ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goToPreviousSlide}
                      className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:border-white/25 hover:text-white"
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={goToNextSlide}
                      className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:border-white/25 hover:text-white"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="overflow-hidden rounded-1.5rem border border-white/10 bg-white/0.03">
                <div
                  className="relative h-28rem sm:h-34rem lg:h-42rem"
                  style={getEventCardStyle(activeSlide.image_url)}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.06)_0%,rgba(5,7,13,0.14)_36%,rgba(5,7,13,0.56)_76%,rgba(5,7,13,0.88)_100%)]" />

                  <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
                    Event #{activeSlide.id}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
                    <div className="max-w-3xl">
                      <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                        {activeSlide.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-200/90 sm:text-base">
                        {activeSlide.description}
                      </p>
                    </div>

                    {slides.length > 1 ? (
                      <div className="mt-8 flex items-center gap-2">
                        {slides.map((event, index) => (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to ${event.title}`}
                            className={`h-2.5 rounded-full transition ${
                              index === activeIndex
                                ? "w-10 bg-white"
                                : "w-2.5 bg-white/45 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          <section className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-white/40">
                Minimal event booking
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Smooth discovery, cleaner visuals, and a calmer booking flow.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Browse the event slider, discover what stands out, and move into
                the product only when you are ready. The homepage stays focused,
                dark, and easy to scan.
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
                    Interface
                  </p>
                  <p className="mt-3 text-lg font-medium text-white">Minimal</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/0.03 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                    Access
                  </p>
                  <p className="mt-3 text-lg font-medium text-white">Login first</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                  Atmosphere
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  Dark, restrained, and event-first.
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  The homepage now puts the visual spotlight on event imagery
                  and keeps everything else intentionally quiet.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                  Motion
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                  Automatic slider with manual control.
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  People can let the events rotate on their own or step through
                  them with the controls when they want to browse intentionally.
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
