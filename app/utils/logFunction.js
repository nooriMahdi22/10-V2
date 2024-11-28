import axios from 'axios'

export async function checkToken() {
  if (!localStorage.getItem('login') || !localStorage.getItem('login').length) {
    return false
  }
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/checkToken`,
      { cache: 'no-store', credentials: 'include' },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      }
    )
    return true
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('کاربر هنوز وارد نشده یا ثبت نام نکرده است')
      return false
    } else {
      console.error('خطای غیرمنتظره:', error)
    }
  }
}

export async function checkAdminOrNo() {
  if (!localStorage.getItem('login') || !localStorage.getItem('login').length) {
    return false
  }
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/checkToken`,
      { cache: 'no-store' },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      }
    )
    console.log(response.data.data.user.role)
    if (response.data.data.user.role == 'admin') {
      return true
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('کاربر هنوز وارد نشده یا ثبت نام نکرده است')
      return false
    } else {
      console.error('خطای غیرمنتظره:', error)
    }
  }
}

export async function checkTokenInfo() {
  if (!localStorage.getItem('login') || !localStorage.getItem('login').length) {
    return false
  }
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/checkToken/`,
      { cache: 'no-store', credentials: 'include' },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('login')}`,
        },
      }
    )
    return response.data.data.user
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('کاربر هنوز وارد نشده یا ثبت نام نکرده است')
      return false
    } else {
      console.error('خطای غیرمنتظره:', error)
    }
  }
}

export async function getInfoWithToken() {
  if (!localStorage.getItem('login') || !localStorage.getItem('login').length) {
    return false
  }

  console.log("localStorage.getItem('login')", localStorage.getItem('login'))
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('login')}`,
      },
      cache: 'no-store',
      withCredentials: true,
    })
    console.log('response.data.data', response.data.data)
    return response.data.data.user
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('کاربر هنوز وارد نشده یا ثبت نام نکرده است')
      return false
    } else {
      console.error('خطای غیرمنتظره:', error)
      return 'error'
    }
  }
}
