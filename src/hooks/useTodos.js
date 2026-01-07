import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'todo-app-data'

const defaultCategories = ['Personal', 'Work', 'Shopping', 'Health', 'Other']

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState(defaultCategories)
  const [filter, setFilter] = useState({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all'
  })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      setTodos(data.todos || [])
      setCategories(data.categories || defaultCategories)
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, categories }))
  }, [todos, categories])

  const addTodo = (todoData) => {
    const newTodo = {
      id: uuidv4(),
      title: todoData.title,
      description: todoData.description || '',
      completed: false,
      priority: todoData.priority || 'medium',
      category: todoData.category || 'Personal',
      dueDate: todoData.dueDate || null,
      dueTime: todoData.dueTime || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTodos(prev => [newTodo, ...prev])
  }

  const updateTodo = (id, updates) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ))
  }

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category])
    }
  }

  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos]

    // Apply filters
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description.toLowerCase().includes(searchLower)
      )
    }

    if (filter.category !== 'all') {
      result = result.filter(todo => todo.category === filter.category)
    }

    if (filter.priority !== 'all') {
      result = result.filter(todo => todo.priority === filter.priority)
    }

    if (filter.status !== 'all') {
      result = result.filter(todo =>
        filter.status === 'completed' ? todo.completed : !todo.completed
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'dueDate':
          // Use T12:00:00 as fallback to avoid timezone issues when no time is set
          const aDateTime = a.dueDate ? new Date(a.dueTime ? `${a.dueDate}T${a.dueTime}` : `${a.dueDate}T12:00:00`) : null
          const bDateTime = b.dueDate ? new Date(b.dueTime ? `${b.dueDate}T${b.dueTime}` : `${b.dueDate}T12:00:00`) : null
          if (!aDateTime && !bDateTime) comparison = 0
          else if (!aDateTime) comparison = 1
          else if (!bDateTime) comparison = -1
          else comparison = aDateTime - bDateTime
          break
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt)
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [todos, filter, sortBy, sortOrder])

  const getDueDateTime = (todo) => {
    if (!todo.dueDate) return null
    const dateStr = todo.dueTime
      ? `${todo.dueDate}T${todo.dueTime}`
      : `${todo.dueDate}T23:59:59`
    return new Date(dateStr)
  }

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => {
      if (t.completed || !t.dueDate) return false
      const dueDateTime = getDueDateTime(t)
      return dueDateTime && dueDateTime < new Date()
    }).length
  }), [todos])

  return {
    todos: filteredAndSortedTodos,
    allTodos: todos,
    categories,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    addCategory
  }
}
