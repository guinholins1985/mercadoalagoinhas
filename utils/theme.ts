// This utility function generates a map of static Tailwind CSS class names
// based on a dynamic theme color. This is crucial for compatibility with
// the Tailwind JIT CDN, which cannot parse dynamically constructed class names
// like `bg-${themeColor}-500`. By using this function, we ensure the full,
// static class name (e.g., 'bg-green-500') is present in the final JSX,
// allowing the JIT compiler to detect and generate the necessary CSS.

const THEME_CONFIG: { [key: string]: { [key: string]: string } } = {
  green: {
    bg100: 'bg-green-100',
    bg500: 'bg-green-500',
    bg600: 'bg-green-600',
    hoverBg600: 'hover:bg-green-600',
    hoverBg700: 'hover:bg-green-700',
    text600: 'text-green-600',
    text700: 'text-green-700',
    text800: 'text-green-800',
    hoverText600: 'hover:text-green-600',
    hoverText800: 'hover:text-green-800',
    focusRing500: 'focus:ring-green-500',
    border500: 'focus:border-green-500',
  },
  blue: {
    bg100: 'bg-blue-100',
    bg500: 'bg-blue-500',
    bg600: 'bg-blue-600',
    hoverBg600: 'hover:bg-blue-600',
    hoverBg700: 'hover:bg-blue-700',
    text600: 'text-blue-600',
    text700: 'text-blue-700',
    text800: 'text-blue-800',
    hoverText600: 'hover:text-blue-600',
    hoverText800: 'hover:text-blue-800',
    focusRing500: 'focus:ring-blue-500',
    border500: 'focus:border-blue-500',
  },
  orange: {
    bg100: 'bg-orange-100',
    bg500: 'bg-orange-500',
    bg600: 'bg-orange-600',
    hoverBg600: 'hover:bg-orange-600',
    hoverBg700: 'hover:bg-orange-700',
    text600: 'text-orange-600',
    text700: 'text-orange-700',
    text800: 'text-orange-800',
    hoverText600: 'hover:text-orange-600',
    hoverText800: 'hover:text-orange-800',
    focusRing500: 'focus:ring-orange-500',
    border500: 'focus:border-orange-500',
  },
  purple: {
    bg100: 'bg-purple-100',
    bg500: 'bg-purple-500',
    bg600: 'bg-purple-600',
    hoverBg600: 'hover:bg-purple-600',
    hoverBg700: 'hover:bg-purple-700',
    text600: 'text-purple-600',
    text700: 'text-purple-700',
    text800: 'text-purple-800',
    hoverText600: 'hover:text-purple-600',
    hoverText800: 'hover:text-purple-800',
    focusRing500: 'focus:ring-purple-500',
    border500: 'focus:border-purple-500',
  },
  pink: {
    bg100: 'bg-pink-100',
    bg500: 'bg-pink-500',
    bg600: 'bg-pink-600',
    hoverBg600: 'hover:bg-pink-600',
    hoverBg700: 'hover:bg-pink-700',
    text600: 'text-pink-600',
    text700: 'text-pink-700',
    text800: 'text-pink-800',
    hoverText600: 'hover:text-pink-600',
    hoverText800: 'hover:text-pink-800',
    focusRing500: 'focus:ring-pink-500',
    border500: 'focus:border-pink-500',
  },
};

export const getThemeClasses = (color: string) => {
  return THEME_CONFIG[color] || THEME_CONFIG.green; // Fallback to green
};
