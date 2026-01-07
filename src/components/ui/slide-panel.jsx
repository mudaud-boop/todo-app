import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export function SlidePanel({ isOpen, onClose, title, children, className }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-lg bg-background border-l shadow-xl z-50",
          "app-region-no-drag",
          className
        )}
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-3 overflow-y-auto h-[calc(100%-57px)]">
          {children}
        </div>
      </div>
    </>
  )
}
