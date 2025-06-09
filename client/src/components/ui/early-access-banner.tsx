"use client"

import { Banner } from "@/components/ui/banner"
import { cn } from "@/lib/utils"

export interface EarlyAccessBannerProps {
  className?: string
}

export function EarlyAccessBanner({ className }: EarlyAccessBannerProps) {
  return (
    <Banner
      variant="info"
      className={cn("py-2 border-x-0 bg-gradient-to-r from-green-100/80 via-green-50 to-green-100/80 shadow-sm", className)}
      title={
        <div className="inline-flex items-center justify-center">
          <span className="flex items-center gap-2 font-medium">
            <span className="text-lg animate-pulse">🚀</span> 
            <span className="text-green-700 font-semibold">Self-Hosted Version:</span>
            <span className="hidden sm:inline text-green-700 mx-1">—</span>
            <span className="hidden sm:inline text-green-700 font-medium">✨ Unlimited MVP Generation! No limits, no subscriptions - completely free!</span>
          </span>
        </div>
      }
    />
  )
}   