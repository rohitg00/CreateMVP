import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-purple-600 text-white hover:from-primary/90 hover:to-purple-600/90",
        subtle: "bg-slate-800/50 text-slate-200 hover:bg-slate-700/70 border border-slate-700/50",
        success: "bg-emerald-600 text-white hover:bg-emerald-700",
        warning: "bg-amber-600 text-white hover:bg-amber-700",
        info: "bg-blue-600 text-white hover:bg-blue-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 text-xs rounded-md px-2 py-1",
        sm: "h-9 text-sm rounded-md px-3 py-1.5",
        lg: "h-11 text-base rounded-md px-6 py-2.5",
        xl: "h-12 text-lg rounded-md px-8 py-3",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
        responsive: "h-9 text-sm px-3 py-1.5 sm:h-10 sm:text-base sm:px-4 sm:py-2 md:h-11 md:px-6",
      },
      fullWidth: {
        true: "w-full",
      },
      rounded: {
        default: "rounded-md",
        full: "rounded-full",
        none: "rounded-none",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      withIcon: {
        true: "inline-flex flex-row items-center justify-center gap-2",
        left: "inline-flex flex-row items-center justify-center gap-2", 
        right: "inline-flex flex-row items-center justify-center gap-2",
      },
      isLoading: {
        true: "relative text-transparent transition-none hover:text-transparent [&_span]:opacity-0 [&_svg]:opacity-0",
      },
    },
    compoundVariants: [
      {
        withIcon: ["true", "left", "right"],
        size: "xs",
        class: "[&_svg]:size-3",
      },
      {
        withIcon: ["true", "left", "right"],
        size: "sm",
        class: "[&_svg]:size-4",
      },
      {
        withIcon: ["true", "left", "right"],
        size: "default",
        class: "[&_svg]:size-5",
      },
      {
        withIcon: ["true", "left", "right"],
        size: "lg",
        class: "[&_svg]:size-5",
      },
      {
        withIcon: ["true", "left", "right"],
        size: "xl",
        class: "[&_svg]:size-6",
      },
      {
        isLoading: true,
        class: "cursor-not-allowed",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    rounded,
    asChild = false, 
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine if we have icons and their position
    const withIcon = leftIcon ? "left" : rightIcon ? "right" : leftIcon && rightIcon ? "true" : undefined;
    
    return (
      <Comp
        className={cn(
          buttonVariants({ 
            variant, 
            size, 
            rounded,
            withIcon, 
            isLoading,
            fullWidth,
            className 
          })
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
        
        {leftIcon && <span className="inline-flex items-center justify-center">{leftIcon}</span>}
        <span className="inline-flex">{isLoading && loadingText ? loadingText : children}</span>
        {rightIcon && <span className="inline-flex items-center justify-center">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
