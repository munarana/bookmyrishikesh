import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

export function generateSlug(title: string) {
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${slugify(title)}-${suffix}`
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const interval of intervals) {
    const value = Math.floor(seconds / interval.seconds)
    if (value >= 1) {
      return `${value} ${interval.label}${value > 1 ? "s" : ""} ago`
    }
  }

  return "just now"
}

export function calculateReadTime(content: string) {
  const text = content.replace(/<[^>]+>/g, " ").trim()
  const words = text ? text.split(/\s+/).length : 0
  return Math.max(1, Math.ceil(words / 200))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", options ?? {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}
