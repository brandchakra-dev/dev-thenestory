/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '320px',    // extra small
      'sm': '640px',     // default sm
      'md': '768px',     // default md
      'lg': '1024px',    // default lg
      'xl': '1280px',    // default xl
      '2xl': '1536px',   // default 2xl
      '3xl': '1920px',   // extra large screens
    },
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },

    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",    // #6B3A1F brand brown
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",  // #000000 black
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",     // #E8D5B0 champagne
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:              "hsl(var(--sidebar-background))",
          foreground:           "hsl(var(--sidebar-foreground))",
          primary:              "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:               "hsl(var(--sidebar-accent))",
          "accent-foreground":  "hsl(var(--sidebar-accent-foreground))",
          border:               "hsl(var(--sidebar-border))",
          ring:                 "hsl(var(--sidebar-ring))",
        },
        // Brand Brown — #6B3A1F (primary)
        brand: {
          50:  "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          300: "hsl(var(--brand-300))",
          400: "hsl(var(--brand-400))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",   // ← #6B3A1F exact
          700: "hsl(var(--brand-700))",
          800: "hsl(var(--brand-800))",
          900: "hsl(var(--brand-900))",
        },
        // Champagne — #E8D5B0 (accent)
        champ: {
          50:  "hsl(var(--champ-50))",
          100: "hsl(var(--champ-100))",
          200: "hsl(var(--champ-200))",
          300: "hsl(var(--champ-300))",   // ← #E8D5B0 exact
          400: "hsl(var(--champ-400))",
          500: "hsl(var(--champ-500))",
          600: "hsl(var(--champ-600))",
          700: "hsl(var(--champ-700))",
          800: "hsl(var(--champ-800))",
          900: "hsl(var(--champ-900))",
        },
        // Warm neutrals
        warm: {
          50:  "hsl(var(--warm-50))",
          100: "hsl(var(--warm-100))",
          200: "hsl(var(--warm-200))",
          300: "hsl(var(--warm-300))",
          400: "hsl(var(--warm-400))",
          500: "hsl(var(--warm-500))",
          600: "hsl(var(--warm-600))",
          700: "hsl(var(--warm-700))",
          800: "hsl(var(--warm-800))",
          900: "hsl(var(--warm-900))",
        },
      },
      borderRadius: {
        sm:    "calc(var(--radius) - 4px)",
        md:    "calc(var(--radius) - 2px)",
        lg:    "var(--radius)",
        xl:    "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      boxShadow: {
        'card':       'var(--shadow-md)',
        'card-hover': 'var(--shadow-xl)',
        'glow':       'var(--shadow-glow)',
        'champ':      'var(--shadow-champ)',
        'luxury':     'var(--shadow-luxury)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in":    { from: { opacity: "0" },                               to: { opacity: "1" } },
        "slide-up":   { from: { opacity: "0", transform: "translateY(20px)" },  to: { opacity: "1", transform: "translateY(0)" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in":   { from: { opacity: "0", transform: "scale(0.95)" },       to: { opacity: "1", transform: "scale(1)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.5s ease-out forwards",
        "slide-up":       "slide-up 0.5s ease-out forwards",
        "slide-down":     "slide-down 0.3s ease-out forwards",
        "scale-in":       "scale-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [typography],
};