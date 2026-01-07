import { useState } from 'react'
import { TaskForm } from './TaskForm'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Calendar, Clock, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TaskItem({ todo, onToggle, onUpdate, onDelete, categories, onAddCategory }) {
  const [isEditing, setIsEditing] = useState(false)

  const priorityVariants = {
    high: 'destructive',
    medium: 'warning',
    low: 'success'
  }

  const getDueDateTime = () => {
    if (!todo.dueDate) return null
    const dateStr = todo.dueTime
      ? `${todo.dueDate}T${todo.dueTime}`
      : `${todo.dueDate}T23:59:59`
    return new Date(dateStr)
  }

  const dueDateTime = getDueDateTime()
  const isOverdue = !todo.completed && dueDateTime && dueDateTime < new Date()

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    // Append T12:00:00 to ensure the date is parsed as local time, not UTC
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  if (isEditing) {
    return (
      <TaskForm
        initialData={{
          title: todo.title,
          description: todo.description,
          priority: todo.priority,
          category: todo.category,
          dueDate: todo.dueDate || '',
          dueTime: todo.dueTime || ''
        }}
        categories={categories}
        onAddCategory={onAddCategory}
        onSubmit={(data) => {
          onUpdate(todo.id, data)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      todo.completed && "opacity-60",
      isOverdue && "border-l-4 border-l-destructive"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-1"
          />

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                "font-medium",
                todo.completed && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </h3>
              <Badge variant={priorityVariants[todo.priority]}>
                {todo.priority}
              </Badge>
            </div>

            {todo.description && (
              <p className="text-sm text-muted-foreground">
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{todo.category}</span>
              </div>
              {todo.dueDate && (
                <div className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-destructive font-medium"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(todo.dueDate)}</span>
                </div>
              )}
              {todo.dueTime && (
                <div className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-destructive font-medium"
                )}>
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(todo.dueTime)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
