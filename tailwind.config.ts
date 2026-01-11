import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // Default Tailwind breakpoints (kept for compatibility)
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',

      // Device-specific breakpoints
      // Small phones (iPhone SE, older Android)
      'xs': '375px',

      // Standard phones (iPhone 12-15, most Android phones)
      'phone': '390px',

      // Large phones (iPhone 14 Pro Max, Samsung Galaxy S series)
      'phone-lg': '428px',

      // Small tablets (iPad Mini, Android tablets)
      'tablet-sm': '768px',

      // Standard tablets (iPad, Surface)
      'tablet': '820px',

      // Large tablets (iPad Pro 11")
      'tablet-lg': '1024px',

      // Extra large tablets (iPad Pro 12.9")
      'tablet-xl': '1366px',

      // Foldable devices
      'fold-closed': '280px',
      'fold-open': '717px',

      // Ultra-wide phones
      'ultrawide': '480px',

      // Landscape specific (height-based)
      'landscape': {'raw': '(orientation: landscape)'},
      'portrait': {'raw': '(orientation: portrait)'},

      // Device pixel ratio
      'retina': {'raw': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'},
    },
    extend: {
      colors: {
        // Jawudi Brand Colors
        'primary-green': '#2DD4BF',
        'deep-navy': '#111827',
        'warm-gold': '#D97706',
        'accent-red': '#DC2626',
        'light-gray': '#F9FAFB',
        'medium-gray': '#6B7280',

        // Jawudi Custom Colors (from design guide)
        'jawudi-navy': '#061834',
        'jawudi-mint': '#81E1AF',
        'jawudi-gold': '#E1C381',
        'jawudi-red': '#B6453A',
        'jawudi-gray': '#E5E6EB',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'Outfit', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        // Safe area spacing
        'safe-top': 'env(safe-area-inset-top)',
        'safe-right': 'env(safe-area-inset-right)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
      },
      height: {
        // Dynamic viewport heights
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
        'screen-dynamic': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      minHeight: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
        'screen-dynamic': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      maxHeight: {
        'dvh': '100dvh',
        'svh': '100svh',
        'lvh': '100lvh',
      },
    },
  },
  plugins: [],
} satisfies Config
