'use cleint'
// components/CapacityPriceInput.js
const CapacityPriceInput = ({ capacity, price, onCapacityChange, onPriceChange, errors, setFormData, setErrors }) => {
  return (
    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
      <div className="space-y-1">
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 text-right">
          ظرفیت
        </label>
        <input
          type="text"
          id="capacity"
          name="capacity"
          value={capacity}
          onChange={onCapacityChange}
          placeholder="ظرفیت"
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            ${errors.capacity ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
        />
        {errors.capacity && <p className="mt-1 text-sm text-red-600 text-right">{errors.capacity}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 text-right">
          قیمت (نفری)
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="text"
            id="price"
            name="price"
            value={price.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, '')
              if (value === '' || /^[0-9]+$/.test(value)) {
                setFormData((prev) => ({
                  ...prev,
                  price: value,
                }))
                // اعتبارسنجی فیلد قیمت
                if (value === '' || isNaN(value) || parseFloat(value) < 0) {
                  setErrors((prev) => ({
                    ...prev,
                    price: 'قیمت دوره باید عددی غیرمنفی باشد',
                  }))
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    price: '',
                  }))
                }
              }
            }}
            placeholder="0"
            className={`block w-full pr-3 pl-16 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-slate-400 text-right
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">تومان</span>
          </div>
        </div>
        {errors.price && <p className="mt-1 text-sm text-red-600 text-right">{errors.price}</p>}
      </div>
    </div>
  )
}

export default CapacityPriceInput
