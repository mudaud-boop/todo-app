import { TaskItem } from './TaskItem'
import { ClipboardList } from 'lucide-react'

export function TaskList({ todos, onToggle, onUpdate, onDelete, categories, onAddCategory }) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <ClipboardList className="h-16 w-16 mb-4 opacity-30" />
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-sm">Add a new task or adjust your filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          categories={categories}
          onAddCategory={onAddCategory}
        />
      ))}
    </div>
  )
}
