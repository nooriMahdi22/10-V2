'use cleint'
// components/DateRangeInput.js
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'

const DateRangeInput = ({ startDate, endDate, onStartChange, onEndChange, errors }) => {
  return (
    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
      <div className="space-y-1 w-full">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 text-right">
          تاریخ شروع
        </label>
        <DatePicker
          id="startDate"
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          value={startDate}
          onChange={onStartChange}
          format="YYYY/MM/DD"
          containerClassName="w-full"
          inputClass={`w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            ${errors.startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
        />
        {errors.startDate && <p className="mt-1 text-sm text-red-600 text-right">{errors.startDate}</p>}
      </div>
      <div className="space-y-1 w-full">
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 text-right">
          تاریخ پایان
        </label>
        <DatePicker
          id="endDate"
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          value={endDate}
          onChange={onEndChange}
          format="YYYY/MM/DD"
          containerClassName="w-full"
          inputClass={`w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            ${errors.endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
        />
        {errors.endDate && <p className="mt-1 text-sm text-red-600 text-right">{errors.endDate}</p>}
      </div>
    </div>
  )
}

export default DateRangeInput
