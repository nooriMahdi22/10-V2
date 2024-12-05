'use client'
import { showToast } from '../utils/alert'

function Test() {
  function handleAlert(params) {
    showToast('info', `${'😭😭😭😭 😁😁😁😁'}`)
  }
  return (
    <>
      <div onClick={handleAlert}>test</div>
    </>
  )
}

export default Test
