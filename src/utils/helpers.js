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
  return num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
