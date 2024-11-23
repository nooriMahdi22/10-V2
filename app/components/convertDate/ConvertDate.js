import { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

export const convertToShamsi = (dateString) => {
  if (!dateString) return ''
  const date = new DateObject(dateString).convert(persian, persian_fa)
  return date.format('YYYY/MM/DD')
}
