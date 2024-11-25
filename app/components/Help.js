let map = {
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
  '۰': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
  '٠': '0',
}
// for use number from persian to english
export function changeToEngNum(value) {
  // if (!value) return null;
  value = value.replace(/[۰۱۲۳۴۵۶۷۸۹١٢٣٤٥٦٧٨٩٠]/g, function (match) {
    return map[match]
  })
  return value
}

let persianMap = {
  1: '۱',
  2: '۲',
  3: '۳',
  4: '۴',
  5: '۵',
  6: '۶',
  7: '۷',
  8: '۸',
  9: '۹',
  0: '۰',
}

export function changeToPersianNum(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value.replace(/[0-9]/g, function (match) {
    return persianMap[match]
  })
}

export function convertToPersianAgo(englishDateTime) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

  const englishDate = new Date(englishDateTime)
  const currentTime = new Date()
  const timeDifference = Math.abs(currentTime - englishDate)
  const seconds = Math.floor(timeDifference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  const convertToPersianNumber = (number) => {
    return number.toString().replace(/\d/g, (digit) => persianNumbers[digit])
  }

  if (seconds < 60) {
    return convertToPersianNumber(seconds) + ' ثانیه پیش'
  } else if (minutes < 60) {
    return convertToPersianNumber(minutes) + ' دقیقه پیش'
  } else if (hours < 24) {
    return convertToPersianNumber(hours) + ' ساعت پیش'
  } else if (days === 1) {
    return 'دیروز'
  } else if (days < 7) {
    return convertToPersianNumber(days) + ' روز پیش'
  } else {
    return convertToPersianNumber(weeks) + ' هفته پیش'
  }
}

export function formatNumberWithComma(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function countTrailingZeros(number) {
  const match = number.toString().match(/0+$/)
  return match ? match[0].length : 0
}

export function convertMoney(price) {
  if (typeof price !== 'number' || isNaN(price)) {
    return { value: '0', unit: 'تومان' }
  }

  if (price === 0) {
    return { value: '0', unit: 'تومان' }
  }

  if (price >= 1e17) {
    return { value: 'بی نهایت', unit: '' }
  }

  const trailingZeros = countTrailingZeros(price)

  if (trailingZeros >= 9) {
    return { value: (price / 1e9).toString(), unit: 'میلیارد تومان' }
  } else if (trailingZeros >= 6) {
    return { value: (price / 1e6).toString(), unit: 'میلیون تومان' }
  } else if (trailingZeros >= 3) {
    return { value: (price / 1e3).toString(), unit: 'هزار تومان' }
  } else {
    return { value: formatNumberWithComma(price), unit: 'تومان' }
  }
}

