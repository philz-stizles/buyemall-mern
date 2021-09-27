import axios from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

export const createCategory = async (data, authtoken) => {
  return await axios.post(`${baseUrl}/categories`, data, {
    headers: { authtoken },
  })
}

export const getCategories = async () => {
  const response = await axios.get(`${baseUrl}/categories`)
  return response.data
}

export const getCategory = async slug => {
  return await axios.get(`${baseUrl}/categories/${slug}`)
}

export const updateCategory = async (slug, data, authtoken) => {
  return await axios.put(`${baseUrl}/categories/${slug}`, data, {
    headers: { authtoken },
  })
}

export const removeCategory = async (slug, authtoken) => {
  return await axios.delete(`${baseUrl}/categories/${slug}`, {
    headers: { authtoken },
  })
}

export const getCategorySubs = async _id =>
  await axios.get(`${baseUrl}/categories/${_id}/subs`)
