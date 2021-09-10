import axios from 'axios'

export const createProduct = async (product, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API_URL}/products`, product, {
    headers: {
      authtoken,
    },
  })

export const upload = async (uri, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/products/upload`,
    { image: uri },
    { headers: { authtoken } }
  )

export const removeImage = async (public_id, authtoken) =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/products/remove-file`,
    { public_id },
    { headers: { authtoken } }
  )

export const getProductsByLimit = async limit =>
  await axios.get(`${process.env.REACT_APP_API_URL}/products?limit=${limit}`)

export const removeProduct = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API_URL}/products/${slug}`, {
    headers: { authtoken },
  })

export const getProduct = async slug =>
  await axios.get(`${process.env.REACT_APP_API_URL}/products/${slug}`)

export const updateProduct = async (slug, product, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API_URL}/products/${slug}`,
    product,
    { headers: { authtoken } }
  )

export const getProducts = async (sort, order, page) =>
  await axios.post(`${process.env.REACT_APP_API_URL}/products/filtered`, {
    sort,
    order,
    page,
  })

export const getProductsTotal = async () =>
  await axios.get(`${process.env.REACT_APP_API_URL}/products/total`)

export const setProductRating = async (productId, star, authtoken) =>
  await axios.put(
    `${process.env.REACT_APP_API_URL}/products/${productId}/set-rating`,
    { star },
    { headers: { authtoken } }
  )

export const getRelatedProducts = async productId =>
  await axios.get(
    `${process.env.REACT_APP_API_URL}/products/${productId}/related`
  )

export const getProductsBySearch = async arg =>
  await axios.post(
    `${process.env.REACT_APP_API_URL}/products/search/filters`,
    arg
  )
