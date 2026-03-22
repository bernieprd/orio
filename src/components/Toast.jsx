import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'

export default function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation on next tick
    const show = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300) // wait for exit transition
    }, 4000)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(timer)
    }
  }, [onDismiss])

  return (
    <div
      className={`
        fixed top-5 right-5 z-50 flex items-center gap-3
        bg-white border border-warm-200 rounded-lg shadow-warm-lg
        px-4 py-3 min-w-[260px]
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
      <span className="text-sm font-medium text-warm-900 flex-1">{message}</span>
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
        className="text-warm-400 hover:text-warm-700 transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  )
}
