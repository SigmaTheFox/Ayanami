function daysInMonth(month, year) {
  switch (month) {
    case 2:
      return (year % 4 == 0 && year % 100) || year % 400 == 0 ? 29 : 28
    case 4:
    case 6:
    case 9:
    case 11:
      return 30
    default:
      return 31
  }
}

module.exports = (d, m, y) => {
  return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y)
}
