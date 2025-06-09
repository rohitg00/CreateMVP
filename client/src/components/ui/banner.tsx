"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const bannerVariants = cva(
  "relative w-full flex items-center justify-center p-4 text-sm border",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        info: "bg-blue-50 border-blue-100 text-blue-800",
        success: "bg-green-50 border-green-100 text-green-800",
        warning: "bg-amber-50 border-amber-100 text-amber-800",
        error: "bg-red-50 border-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: {
    label: React.ReactNode
    onClick: () => void
  }
  show?: boolean
  onHide?: () => void
}

export function Banner({
  title,
  description,
  icon,
  action,
  show = true,
  onHide,
  className,
  variant,
  ...props
}: BannerProps) {
  if (!show) return null

  return (
    <div className={cn(bannerVariants({ variant }), className)} {...props}>
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1 text-center">
          <div className="font-medium">{title}</div>
          {description && (
            <div className="mt-0.5 text-sm opacity-90">{description}</div>
          )}
        </div>
        {action && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-shrink-0 shadow-sm",
              variant === "info" && "border-blue-200 hover:bg-blue-100/50",
              variant === "success" && "border-green-200 hover:bg-green-100/50",
              variant === "warning" && "border-amber-200 hover:bg-amber-100/50",
              variant === "error" && "border-red-200 hover:bg-red-100/50"
            )}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
      </div>
      {onHide && (
        <button
          onClick={onHide}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-foreground/60 hover:text-foreground focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background"
          aria-label="Close banner"
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M1 1L11 11M1 11L11 1" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
} 