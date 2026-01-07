import { useEffect, useRef, useCallback, useState } from 'react'

const NOTIFICATION_LEAD_TIME = 5 * 60 * 1000 // 5 minutes in milliseconds
const CHECK_INTERVAL = 30 * 1000 // Check every 30 seconds

export function useNotifications(todos) {
  const notifiedTasks = useRef(new Set())
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Check notification support on mount
  useEffect(() => {
    const checkSupport = async () => {
      // Check for Electron API first (native desktop notifications)
      if (window.electronAPI?.notificationsSupported) {
        const supported = await window.electronAPI.notificationsSupported()
        setNotificationsEnabled(supported)
      } else if ('Notification' in window) {
        // Fall back to Web Notification API
        setNotificationsEnabled(Notification.permission === 'granted')
      }
    }
    checkSupport()
  }, [])

  const requestPermission = useCallback(async () => {
    // Electron notifications don't need permission on most platforms
    if (window.electronAPI?.notificationsSupported) {
      const supported = await window.electronAPI.notificationsSupported()
      setNotificationsEnabled(supported)
      return
    }

    // Web Notification API fallback
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true)
        return
      }
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        setNotificationsEnabled(permission === 'granted')
      }
    }
  }, [])

  const sendNotification = useCallback(async (todo) => {
    if (!notificationsEnabled) return

    const title = 'Task Due Soon!'
    const body = `"${todo.title}" is due in 5 minutes`

    // Use Electron native notifications if available
    if (window.electronAPI?.showNotification) {
      await window.electronAPI.showNotification(title, body)
      return
    }

    // Fall back to Web Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        tag: todo.id,
        requireInteraction: true
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      setTimeout(() => notification.close(), 30000)
    }
  }, [notificationsEnabled])

  const checkUpcomingTasks = useCallback(() => {
    if (!notificationsEnabled) return

    const now = new Date()

    todos.forEach(todo => {
      // Skip if already completed or notified
      if (todo.completed || notifiedTasks.current.has(todo.id)) return

      // Skip if no due date
      if (!todo.dueDate) return

      // Calculate due datetime
      const dueDateTime = todo.dueTime
        ? new Date(`${todo.dueDate}T${todo.dueTime}`)
        : new Date(`${todo.dueDate}T23:59:59`)

      const timeUntilDue = dueDateTime - now

      // Send notification if task is due within 5 minutes (but not already past)
      if (timeUntilDue > 0 && timeUntilDue <= NOTIFICATION_LEAD_TIME) {
        sendNotification(todo)
        notifiedTasks.current.add(todo.id)
      }
    })
  }, [todos, sendNotification, notificationsEnabled])

  // Set up interval to check for upcoming tasks
  useEffect(() => {
    if (!notificationsEnabled) return

    // Initial check
    checkUpcomingTasks()

    // Set up periodic checks
    const interval = setInterval(checkUpcomingTasks, CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [checkUpcomingTasks, notificationsEnabled])

  // Clear notified status when a task is deleted
  useEffect(() => {
    const currentIds = new Set(todos.map(t => t.id))

    notifiedTasks.current.forEach(id => {
      if (!currentIds.has(id)) {
        notifiedTasks.current.delete(id)
      }
    })
  }, [todos])

  const testNotification = useCallback(async () => {
    const title = 'Test Notification'
    const body = 'Your notifications are working!'

    // Use Electron native notifications if available
    if (window.electronAPI?.showNotification) {
      await window.electronAPI.showNotification(title, body)
      return
    }

    // Fall back to Web Notification API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  }, [])

  return {
    notificationsEnabled,
    requestPermission,
    testNotification
  }
}
