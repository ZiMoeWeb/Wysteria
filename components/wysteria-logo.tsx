export function WysteriaLogo() {
  return (
    <div className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#wysteria-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <defs>
          <linearGradient id="wysteria-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M18 6a4 4 0 0 0-4 4" />
        <line x1="12" y1="12" x2="12" y2="12.01" />
      </svg>
      Wysteria.ai
    </div>
  )
}

