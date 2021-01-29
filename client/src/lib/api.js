import axios from 'axios'

import { getToken } from './auth'

const baseUrl = '/api'



function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` }
  }
}

export function getSinglePic(id) {
  return axios.get(`${baseUrl}/pics/${id}/`)
}

export function getAllPics(){
  return axios.get(`${baseUrl}/pics/`)
}

export function createPic(formdata){
  return axios.post(`${baseUrl}/pics/`,formdata)
}

export function getUserInfo() {
  return axios.get('/api/auth/profile/', headers())
} 

export function createComment(formdata) {
  return axios.post('/api/comments/', formdata, headers() )
}