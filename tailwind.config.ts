import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'xs': '475px',     // Extra small devices
      'sm': '640px',     // Small devices (phones)
      'md': '768px',     // Medium devices (tablets)
      'lg': '1024px',    // Large devices (laptops)
      'xl': '1280px',    // Extra large devices (desktops)
      '2xl': '1536px',   // 2X large devices (large desktops)
      '3xl': '1920px',   // 3X large devices (ultra-wide monitors)
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      fontSize: {
        'xxs': '0.625rem',      // 10px
        'xs': '0.75rem',        // 12px
        'sm': '0.875rem',       // 14px 
        'base': '1rem',         // 16px
        'lg': '1.125rem',       // 18px
        'xl': '1.25rem',        // 20px
        '2xl': '1.5rem',        // 24px
        '3xl': '1.875rem',      // 30px
        '4xl': '2.25rem',       // 36px
        '5xl': '3rem',          // 48px
        '6xl': '3.75rem',       // 60px
        '7xl': '4.5rem',        // 72px
        '8xl': '6rem',          // 96px
        '9xl': '8rem',          // 128px
      },
      maxWidth: {
        'mobile': '440px',
        'tablet': '640px',
        'laptop': '1024px',
        'desktop': '1280px',
        'content': '72ch',      // Optimal reading width
      },
      lineHeight: {
        'tighter': '1.1',
        'relaxed': '1.75',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" }
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" }
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-position": "0% 0%",
            "opacity": "0.5"
          },
          "25%": {
            "background-position": "100% 0%",
            "opacity": "0.8"
          },
          "50%": {
            "background-position": "100% 100%",
            "opacity": "1"
          },
          "75%": {
            "background-position": "0% 100%",
            "opacity": "0.8"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float-slow 5s ease-in-out infinite",
        "float-medium": "float-medium 4s ease-in-out infinite",
        "float-fast": "float-fast 3s ease-in-out infinite",
        "gradient-xy": "gradient-xy 10s ease infinite"
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    function({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('supports-grid', '@supports (display: grid)');
      addVariant('supports-flex', '@supports (display: flex)');
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)');
    }
  ],
} satisfies Config;
