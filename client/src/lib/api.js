import axios from 'axios'

import { getToken } from './auth'

const baseUrl = '/api'

function headers() {
  return {
    headers: { Authorization: `Bearer ${getToken()}` }
  }
}


//* pic
export function getSinglePic(id) {
  return axios.get(`${baseUrl}/pics/${id}/`)
}

export function deletePic(id) {
  return axios.delete(`${baseUrl}/pics/${id}/`, headers() )
}

export function getAllPics(){
  return axios.get(`${baseUrl}/pics/`)
}

export function createPic(formdata){
  return axios.post(`${baseUrl}/pics/`,formdata)
}




//* user

export function getUserInfo() {
  return axios.get(`${baseUrl}/auth/profile/`, headers())
} 

export function getArtistPics(id) {
  return axios.get(`${baseUrl}/auth/${id}/artist_profile/`)
}





//* user interaction

export function createComment(formdata) {
  return axios.post(`${baseUrl}/comments/`, formdata, headers() )
}

export function deleteComment(id) {
  return axios.delete(`${baseUrl}/comments/${id}/`, headers() )
}


export function favorite(picId) {
  return axios.post(`${baseUrl}/pics/${picId}/favorite/`, null, headers() )
}

export function unFavorite(picId) {
  return axios.delete(`${baseUrl}/pics/${picId}/favorite/`, headers() )
}

export function followArtist(id) {
  return axios.post(`${baseUrl}/auth/${id}/follow/`, null, headers() )
}

export function unfollowArtist(id) {
  return axios.delete(`${baseUrl}/auth/${id}/follow/`, headers() )
}



