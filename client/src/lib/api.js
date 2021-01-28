import axios from 'axios'

const baseUrl = '/api'

// function headers() {
//   return {
//     headers: { Authorization: `Bearer ${getToken()}` }
//   }
// }

export function getSinglePic(id) {
  return axios.get(`${baseUrl}/pics/${id}/`)
}

export function getAllPics(){
  return axios.get(`${baseUrl}/pics/`)
}

export function createPic(formdata){
  return axios.post(`${baseUrl}/pics/`,formdata)
}
