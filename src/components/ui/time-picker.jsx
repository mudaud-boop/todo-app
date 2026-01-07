import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TimePicker({ value, onChange, placeholder = "Pick a time" }) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const scrollRef = React.useRef(null)

  // Generate time options (every 5 minutes)
  const timeOptions = React.useMemo(() => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const h = String(hour).padStart(2, '0')
        const m = String(minute).padStart(2, '0')
        options.push(`${h}:${m}`)
      }
    }
    return options
  }, [])

  // Format 24h time to 12h display
  const formatTime = (timeStr) => {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Parse various time input formats to HH:MM
  const parseTimeInput = (input) => {
    if (!input) return null

    const trimmed = input.trim().toLowerCase()

    // Try to match common formats
    // Format: 1:30 PM, 1:30PM, 13:30, 130, 1330, etc.

    // Check for AM/PM
    const isPM = trimmed.includes('pm') || trimmed.includes('p')
    const isAM = trimmed.includes('am') || trimmed.includes('a')

    // Remove AM/PM markers and spaces
    const cleaned = trimmed.replace(/[ap]\.?m?\.?/gi, '').replace(/\s/g, '')

    let hours, minutes

    // Format: HH:MM or H:MM
    if (cleaned.includes(':')) {
      const parts = cleaned.split(':')
      hours = parseInt(parts[0], 10)
      minutes = parseInt(parts[1], 10)
    }
    // Format: HHMM or HMM (e.g., 1330 or 130)
    else if (cleaned.length >= 3 && cleaned.length <= 4) {
      if (cleaned.length === 4) {
        hours = parseInt(cleaned.slice(0, 2), 10)
        minutes = parseInt(cleaned.slice(2), 10)
      } else {
        hours = parseInt(cleaned.slice(0, 1), 10)
        minutes = parseInt(cleaned.slice(1), 10)
      }
    }
    // Format: HH or H (assume :00 minutes)
    else if (cleaned.length <= 2) {
      hours = parseInt(cleaned, 10)
      minutes = 0
    }
    else {
      return null
    }

    // Validate
    if (isNaN(hours) || isNaN(minutes)) return null
    if (minutes < 0 || minutes > 59) return null
    if (hours < 0 || hours > 23) return null

    // Convert 12h to 24h if AM/PM specified
    if (isPM && hours < 12) hours += 12
    if (isAM && hours === 12) hours = 0

    // Format as HH:MM
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      const parsed = parseTimeInput(inputValue)
      if (parsed) {
        onChange(parsed)
        setInputValue('')
        setOpen(false)
      }
    }
  }

  const handleInputBlur = () => {
    const parsed = parseTimeInput(inputValue)
    if (parsed) {
      onChange(parsed)
      setInputValue('')
    }
  }

  const handleSelect = (time) => {
    onChange(time)
    setInputValue('')
    setOpen(false)
  }

  // Scroll to selected time when popover opens
  React.useEffect(() => {
    if (open && value && scrollRef.current) {
      const index = timeOptions.indexOf(value)
      if (index !== -1) {
        // Each button is roughly 36px tall
        scrollRef.current.scrollTop = Math.max(0, index * 36 - 100)
      }
    }
  }, [open, value, timeOptions])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatTime(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Type time (e.g. 2:30 PM)"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-64" ref={scrollRef}>
          <div className="p-2">
            {timeOptions.map((time) => (
              <Button
                key={time}
                variant={value === time ? "default" : "ghost"}
                className="w-full justify-start font-normal mb-1"
                onClick={() => handleSelect(time)}
              >
                {formatTime(time)}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
