'use client'
import { showToast, ToastNotifications } from '../utils/alert'

function Test() {
  function handleAlert(params) {
    showToast('info', `${'مشکلی پیش امده اینترنت خود را بررسی کنید'}`)
  }
  return (
    <>
      <ToastNotifications />
      <div onClick={handleAlert}>test</div>
    </>
  )
}

export default Test
