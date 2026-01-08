import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { useNotifications } from './hooks/useNotifications'
import { useTheme } from './hooks/useTheme'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import { Stats } from './components/Stats'
import { Button } from '@/components/ui/button'
import { Plus, CheckSquare, Bell, BellOff, Moon, Sun, Calendar } from 'lucide-react'
import { SlidePanel } from '@/components/ui/slide-panel'
import { CalendarView } from './components/CalendarView'

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
  const [quickMode, setQuickMode] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card app-region-drag shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="w-20" /> {/* Spacer for centering */}
            <div className="flex items-center gap-2">
              <CheckSquare className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-semibold">Tick</h1>
            </div>
            <div className="flex items-center gap-1 app-region-no-drag">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCalendar(true)}
                title="Open calendar view"
              >
                <Calendar className="h-5 w-5" />
              </Button>
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

      <main className="container mx-auto px-6 py-8">
        <Stats stats={stats} />

        <div className="mb-6">
          {showForm ? (
            <TaskForm
              categories={categories}
              onAddCategory={addCategory}
              onSubmit={(data) => {
                addTodo(data)
                setShowForm(false)
                setQuickMode(false)
              }}
              onCancel={() => {
                setShowForm(false)
                setQuickMode(false)
              }}
              quickMode={quickMode}
            />
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setQuickMode(true)
                  setShowForm(true)
                }}
                className="flex-1 h-14 text-base"
                variant="outline"
              >
                <Plus className="mr-2 h-5 w-5" />
                Quick Task
              </Button>
              <Button
                onClick={() => {
                  setQuickMode(false)
                  setShowForm(true)
                }}
                className="flex-1 h-14 text-base"
                variant="outline"
              >
                <Plus className="mr-2 h-5 w-5" />
                Full Task
              </Button>
            </div>
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

      <SlidePanel
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        title="Calendar View"
      >
        <CalendarView todos={allTodos} onToggle={toggleComplete} />
      </SlidePanel>
    </div>
  )
}

export default App
