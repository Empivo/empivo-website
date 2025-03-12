/* global localStorage */
const axios = require('axios')

function getHeaders () {
  return { 'Content-Type': 'application/json' }
}
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL
  // timeout: 1000,
  // headers: getHeaders(),
})

function apiGet (url, params = {}) {
  return instance.get(url, { params })
}

function apiPost (url, body) {
  return instance.post(url, body)
}

function apiPut (url, body) {
  return instance.put(url, body)
}

function apiDelete (url, body) {
  return instance.delete(url, { params: body })
}

export { getHeaders, apiGet, apiPost, apiPut, apiDelete }
