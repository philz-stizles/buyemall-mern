import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import { Menu, Slider, Checkbox } from 'antd';
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from '@ant-design/icons';

// API Actions
import { getProductsByLimit, getProductsBySearch } from '../actions/product';
import { getCategories } from '../actions/category';
import { getSubCategories } from '../actions/sub-category';
// Filter Components
import ShippingFilter from '../components/shop/ShippingFilter';
import ColorFilter from '../components/shop/ColorFilter';
import BrandFilter from './../components/shop/BrandFilter';
import SubCategoryFilter from '../components/shop/SubCategoryFilter';
import RatingFilter from '../components/shop/RatingFilter';

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subs, setSubCategories] = useState([]);
  const brandRef = useRef()
  const colorRef = useRef()
  const shippingRef = useRef()
  const subCategoryRef = useRef()
  const ratingRef = useRef()

  let dispatch = useDispatch();
  let { text } = useSelector((state) => state.search);

  useEffect(() => {
    loadProducts();
    getCategories().then((res) => setCategories(res.data));
    getSubCategories().then((res) => setSubCategories(res.data));
  }, []);

  const fetchProducts = (arg) => {
    console.log(arg);
    getProductsBySearch(arg).then((res) => {
      setProducts(res.data);
    });
  };

  const resetFilters = () => {
    brandRef.current.reset()
    colorRef.current.reset()
    shippingRef.current.reset()
    subCategoryRef.current.reset()
  };

  // 1. load products by default on page load
  const loadProducts = () => {
    getProductsByLimit(10).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ search: text });
      if (!text) {
        loadProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    console.log('ok to request');
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: '',
    });
    resetFilters()

    // Set price
    setPrice(value);

    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. load products based on category
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  // handle check for categories
  const handleCheck = (e) => {
    // reset search input
    dispatch({
      type: 'SEARCH_QUERY',
      payload: '',
    });

    resetFilters()

    console.log(e.target.value);
    let selectedCategories = [...categoryIds];
    let currentChecked = e.target.value;
    let indexOfCurrentChecked = selectedCategories.indexOf(currentChecked); // index or -1

    // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
    if (indexOfCurrentChecked === -1) {
      selectedCategories.push(currentChecked);
    } else {
      // if found pull out one item from index
      selectedCategories.splice(indexOfCurrentChecked, 1);
    }

    setCategoryIds(selectedCategories);
    fetchProducts({ category: selectedCategories });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/Filter</h4>
          <hr />

          <Menu
            defaultOpenKeys={['1', '2', '3', '4', '5', '6', '7']}
            mode="inline"
          >
            {/* price */}
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined /> Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `$${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                />
              </div>
            </SubMenu>

            {/* category */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Categories
                </span>
              }
            >
              <div style={{ margin: '10px 0' }}>{showCategories()}</div>
            </SubMenu>

            {/* stars */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined /> Rating
                </span>
              }
            >
              <RatingFilter ref={ratingRef} resetFilters={resetFilters} filterProducts={fetchProducts} />
            </SubMenu>

            {/* sub category */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Sub Categories
                </span>
              }
            >
              <SubCategoryFilter subs={subs} ref={subCategoryRef} resetFilters={resetFilters} filterProducts={fetchProducts} />
            </SubMenu>

            {/* brands */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            ><BrandFilter ref={brandRef} resetFilters={resetFilters} filterProducts={fetchProducts} /></SubMenu>

            {/* colors */}
            <Menu.SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }><ColorFilter ref={colorRef} resetFilters={resetFilters} filterProducts={fetchProducts} /></Menu.SubMenu>
            
            {/* shipping */}
            <Menu.SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }><ShippingFilter ref={shippingRef} resetFilters={resetFilters} filterProducts={fetchProducts} /></Menu.SubMenu>
            
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
