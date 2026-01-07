import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { Plus, X } from 'lucide-react'

export function TaskForm({ onSubmit, categories, onAddCategory, initialData, onCancel, quickMode = false }) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    priority: 'medium',
    category: categories[0] || 'Personal',
    dueDate: '',
    dueTime: ''
  })
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSubmit(formData)
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        category: categories[0] || 'Personal',
        dueDate: '',
        dueTime: ''
      })
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim())
      setFormData(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory('')
      setShowNewCategory(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              autoFocus
            />
          </div>

          {!quickMode && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description (optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          )}

          <div className={`grid grid-cols-1 ${quickMode ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4`}>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleAddCategory}>
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewCategory(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" size="icon" variant="outline" onClick={() => setShowNewCategory(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <DatePicker
                value={formData.dueDate}
                onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value }))}
                placeholder="Pick a date"
              />
            </div>

            <div className="space-y-2">
              <Label>Due Time</Label>
              <TimePicker
                value={formData.dueTime}
                onChange={(value) => setFormData(prev => ({ ...prev, dueTime: value }))}
                placeholder="Pick a time"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {initialData ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
