import axios from 'axios'

export function signUpUser(formdata) {
  return axios.post('/api/auth/register/', formdata)
}

export function loginUser(formdata) {
  return axios.post('/api/auth/login/', formdata)
}

export function setToken(token) {
  window.localStorage.setItem('token', token) 
}

export function getToken() {
  return  window.localStorage.getItem('token')
}

export function logout() {
  return  window.localStorage.removeItem('token')  
}




function getPayload() {
  const token = getToken()
  if (!token) return false
  const parts = token.split('.') 
  if (parts.length < 3) return false 
  return JSON.parse(atob(parts[1])) 
}


export function isAuthenticated() {
  const payload = getPayload()
  if (!payload) return false 
  const now = Math.round(Date.now() / 1000) 
  console.log(payload.exp)
  console.log(now)
  console.log(now < payload.exp)
  return now < payload.exp

}