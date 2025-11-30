interface DailyLimitData {
  count: number
  date: string
}

export const DAILY_CONTACT_LIMIT = 50

export function getDailyViewCount(): DailyLimitData {
  if (typeof window === 'undefined') {
    return { count: 0, date: new Date().toDateString() }
  }

  const today = new Date().toDateString()
  const stored = localStorage.getItem('daily_contact_views')
  
  if (!stored) {
    return { count: 0, date: today }
  }

  try {
    const data: DailyLimitData = JSON.parse(stored)
    
    // Reset count if it's a new day
    if (data.date !== today) {
      return { count: 0, date: today }
    }
    
    return data
  } catch {
    return { count: 0, date: today }
  }
}

export function incrementDailyViewCount(): DailyLimitData {
  if (typeof window === 'undefined') {
    return { count: 0, date: new Date().toDateString() }
  }

  const current = getDailyViewCount()
  const updated = {
    count: current.count + 1,
    date: current.date
  }
  
  localStorage.setItem('daily_contact_views', JSON.stringify(updated))
  return updated
}

export function hasExceededDailyLimit(): boolean {
  const data = getDailyViewCount()
  return data.count >= DAILY_CONTACT_LIMIT
}

export function getRemainingViews(): number {
  const data = getDailyViewCount()
  return Math.max(0, DAILY_CONTACT_LIMIT - data.count)
}