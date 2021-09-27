import React, { useState, useEffect } from 'react';
import AdminNav from '../../../components/navs/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined } from '@ant-design/icons';
import { createProduct } from '../../../actions/product';
import ProductForm from '../../../components/forms/ProductCreateForm';
import { getCategories, getCategorySubs } from '../../../actions/category';

const initialState = {
  title: 'Macbook Pro',
  description: 'This is the best Apple product',
  price: '45000',
  categories: [],
  category: '',
  subs: [],
  shipping: 'Yes',
  quantity: '50',
  images: [],
  colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
  brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'],
  color: 'White',
  brand: 'Apple',
};

const ProductCreate = () => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [loading, setLoading] = useState(false);

  // redux hook(s)
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setValues({ ...values, categories: c.data }));

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        console.log(res);
        window.alert(`"${res.data.title}" is created`);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 400) toast.error(err.response.data);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name, " ----- ", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    const value = e.target.value.trim();
    console.log('CLICKED CATEGORY', value);
    setValues({ ...values, subs: [], category: value });
    if (value !== '') {
      getCategorySubs(e.target.value).then((res) => {
        console.log('SUB OPTIONS ON CATGORY CLICK', res);
        setSubOptions(res.data);
      });
    } else {
      setSubOptions([]);
    }
    setShowSubCategories(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product create</h4>
          )}

          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCatagoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSubCategories={showSubCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
