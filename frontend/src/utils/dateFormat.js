// Format dates as DD-MMM-YYYY (day-month-year)
export const formatDate = (dateString, includeYear = true) => {
  const date = new Date(dateString)
  const options = {
    day: 'numeric',
    month: 'short',
    year: includeYear ? 'numeric' : undefined
  }
  return date.toLocaleDateString('en-GB', options)
}

// Format with time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const dateStr = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  const timeStr = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${dateStr} ${timeStr}`
}

// Format date range (start to end)
export const formatDateRange = (startDateString, endDateString) => {
  const start = new Date(startDateString)
  const end = new Date(endDateString)

  const startStr = start.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  })

  const endStr = end.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return `${startStr} - ${endStr}`
}
