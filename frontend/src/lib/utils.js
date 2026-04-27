import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const BACKEND_BASE_URL = "http://127.0.0.1:8000"
const PRICE_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
})

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function resolveMediaUrl(mediaPath) {
  const cleanMediaPath = mediaPath?.trim()

  if (!cleanMediaPath) {
    return ""
  }

  if (
    cleanMediaPath.startsWith("http://") ||
    cleanMediaPath.startsWith("https://") ||
    cleanMediaPath.startsWith("data:") ||
    cleanMediaPath.startsWith("blob:")
  ) {
    return cleanMediaPath
  }

  return `${BACKEND_BASE_URL}${
    cleanMediaPath.startsWith("/") ? cleanMediaPath : `/${cleanMediaPath}`
  }`
}

export function getEventCardStyle(imageUrl) {
  const cleanImageUrl = resolveMediaUrl(imageUrl)

  if (cleanImageUrl) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(5, 7, 13, 0.18) 0%, rgba(5, 7, 13, 0.78) 100%), url(${cleanImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }

  return {
    backgroundImage:
      "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)",
  }
}

export function formatEventPrice(price) {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Free"
  }

  return PRICE_FORMATTER.format(numericPrice)
}
