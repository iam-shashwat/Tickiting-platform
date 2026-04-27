import { useEffect, useState } from "react"
import { formatEventPrice, getEventCardStyle } from "../lib/utils"

export default function Slider({ events, loading, error }) {
  const [currentSlide, setCurrentSlide] = useState(0)

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
    }, 4500)

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

  if (loading) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/0.03 p-4">
        <div className="h-96 rounded-[1.5rem] bg-white/0.04 sm:h-96 lg:h-160" />
        <div className="mt-4 h-7 w-1/3 rounded-full bg-white/10" />
        <div className="mt-3 h-4 w-full rounded-full bg-white/10" />
        <div className="mt-2 h-4 w-5/6 rounded-full bg-white/10" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
        <p className="text-lg font-medium text-white">Events could not be loaded.</p>
        <p className="mt-2 text-sm text-zinc-400">{error}</p>
      </div>
    )
  }

  if (!activeSlide) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/0.03 p-6">
        <p className="text-lg font-medium text-white">No events yet</p>
        <p className="mt-2 text-sm text-zinc-400">
          Create events from the admin dashboard and they will appear here.
        </p>
      </div>
    )
  }

  return (
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

      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/0.03">
        <div
          className="relative h-96 sm:h-136 lg:h-168"
          style={getEventCardStyle(activeSlide.image_url)}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0.06)_0%,rgba(5,7,13,0.14)_36%,rgba(5,7,13,0.56)_76%,rgba(5,7,13,0.88)_100%)]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
            Event #{activeSlide.id}
          </div>
          <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            {formatEventPrice(activeSlide.price)}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">
                Ticket price {formatEventPrice(activeSlide.price)}
              </p>
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
  )
}
