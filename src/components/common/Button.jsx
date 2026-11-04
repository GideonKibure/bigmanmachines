const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  ghost: 'border border-white/40 bg-transparent text-white hover:border-white',
  quiet: 'bg-transparent px-0 text-accent hover:text-accent-dark',
  danger: 'bg-red-600 text-white hover:bg-red-500',
  surface: 'border border-line bg-white text-ink hover:border-accent',
}

export function buttonClass(variant = 'primary', className = '') {
  return `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${variants[variant]} ${className}`
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button className={buttonClass(variant, className)} {...props}>
      {children}
    </button>
  )
}
