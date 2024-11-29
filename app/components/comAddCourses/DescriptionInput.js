'use cleint'
// components/DescriptionInput.js
const DescriptionInput = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 text-right">
        توضیحات
      </label>
      <textarea
        id="description"
        name="description"
        value={value}
        onChange={onChange}
        placeholder="توضیحات دوره"
        rows="4"
        dir="rtl"
        className={`w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
      />
      {error && <p className="mt-1 text-sm text-red-600 text-right">{error}</p>}
    </div>
  )
}

export default DescriptionInput
