import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
}

export function CalendarView({ todos, onToggle }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Get dates that have tasks
  const taskDates = useMemo(() => {
    const dates = {}
    todos.forEach(todo => {
      if (todo.dueDate) {
        const dateKey = todo.dueDate
        if (!dates[dateKey]) {
          dates[dateKey] = []
        }
        dates[dateKey].push(todo)
      }
    })
    return dates
  }, [todos])

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd')
    return taskDates[dateKey] || []
  }, [selectedDate, taskDates])

  // Dates with tasks for highlighting
  const datesWithTasks = useMemo(() => {
    return Object.keys(taskDates).map(dateStr => new Date(dateStr + 'T00:00:00'))
  }, [taskDates])

  return (
    <div className="space-y-4">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          modifiers={{
            hasTasks: datesWithTasks
          }}
          modifiersStyles={{
            hasTasks: {
              fontWeight: 'bold',
              textDecoration: 'underline',
              textDecorationColor: 'hsl(var(--primary))',
              textUnderlineOffset: '4px'
            }
          }}
        />
      </div>

      <div className="border-t pt-3">
        <h3 className="font-medium mb-2 text-sm">
          Tasks for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>

        {selectedDateTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No tasks scheduled for this day</p>
        ) : (
          <div className="space-y-2">
            {selectedDateTasks.map(task => (
              <div
                key={task.id}
                className={cn(
                  "p-2 rounded-lg border bg-card cursor-pointer transition-opacity hover:bg-accent",
                  task.completed && "opacity-60"
                )}
                onClick={() => onToggle(task.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full mt-1.5 flex-shrink-0",
                    priorityColors[task.priority]
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                      {task.dueTime && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
