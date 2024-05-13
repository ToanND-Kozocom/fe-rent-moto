import moment from 'moment'

export const dateToString = date => {
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0')
  )
}

export const priceString = num => {
  if (!num) {
    return 0
  }
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export const checkDateInCalendars = (date, calendars) => {
  const currentDate = moment(dateToString(new Date(date)))
  for (let element of calendars) {
    const startDate = moment(element.start_date)
    const endDate = moment(element.end_date)
    if (currentDate.isBetween(startDate, endDate, null, '[]')) {
      return true
    }
  }
  return false
}

export const checkRentDate = (startDate, endDate, calendars) => {
  const startDateN = moment(dateToString(new Date(startDate)))
  const endDateN = moment(dateToString(new Date(endDate)))

  for (let element of calendars) {
    const dateCalendar = moment(element.start_date)
    if (dateCalendar.isBetween(startDateN, endDateN, null, '[]')) {
      return true
    }
  }
  return false
}

export const daysDifference = (startDate, endDate) => {
  const date1 = new Date(startDate)
  const date2 = new Date(endDate)
  const difference = Math.abs(date2 - date1)
  const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24))
  return daysDifference + 1
}
