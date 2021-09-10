import axios from 'axios';

export const createSubCategory = async (data, authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/sub-categories`, data, { headers: { authtoken } })
}

export const getSubCategories = async () => await axios.get(`${process.env.REACT_APP_API_URL}/sub-categories`);

export const getSubCategory = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/sub-categories/${slug}`)
}

export const updateSubCategory = async (slug, data, authtoken) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/sub-categories/${slug}`, data, { headers: { authtoken } })
}

export const removeSubCategory = async (slug, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API_URL}/sub-categories/${slug}`, { headers: { authtoken } })
}