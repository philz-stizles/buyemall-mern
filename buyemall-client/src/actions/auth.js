import axios from 'axios';

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/users/create-or-update`, {}, { headers: { authtoken } })
}

export const getCurrentUser = async (authtoken) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/users/current-user`, { headers: { authtoken } })
}

export const getCurrentAdmin = async (authtoken) => {
  return await axios.get(
    `${process.env.REACT_APP_API_URL}/users/current-admin`, 
    { headers: { authtoken } })
}
