import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { useNotifications } from './hooks/useNotifications'
import { useTheme } from './hooks/useTheme'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import { Stats } from './components/Stats'
import { Button } from '@/components/ui/button'
import { Plus, CheckSquare, Bell, BellOff, Moon, Sun } from 'lucide-react'

function App() {
  const {
    todos,
    allTodos,
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
  } = useTodos()

  // Enable notifications for all todos (not just filtered)
  const { notificationsEnabled, requestPermission, testNotification } = useNotifications(allTodos)

  // Theme management
  const { theme, toggleTheme } = useTheme()

  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card app-region-drag">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between app-region-no-drag">
            <div className="w-20" /> {/* Spacer for centering */}
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Mu's Todo's</h1>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={notificationsEnabled ? testNotification : requestPermission}
                title={notificationsEnabled ? "Test notification" : "Enable notifications"}
              >
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5 text-green-500" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Stats stats={stats} />

        <div className="mb-6">
          {showForm ? (
            <TaskForm
              categories={categories}
              onAddCategory={addCategory}
              onSubmit={(data) => {
                addTodo(data)
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full h-14 text-base"
              variant="outline"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Task
            </Button>
          )}
        </div>

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categories}
        />

        <TaskList
          todos={todos}
          onToggle={toggleComplete}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          categories={categories}
          onAddCategory={addCategory}
        />
      </main>
    </div>
  )
}

export default App
