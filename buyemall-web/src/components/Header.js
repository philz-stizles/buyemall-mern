import { Badge, Menu } from 'antd';
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { LOGOUT } from '../store/actions/types';
import Search from './forms/Search';

const { SubMenu, Item } = Menu;

const Header = () => {
  const [activeLink, setActiveLink] = useState('home');

  // Redux hooks
  const dispatch = useDispatch();
  let { user, cart } = useSelector((state) => ({ ...state }));

  // Router hooks
  const history = useHistory(); // Use react-router-dom's useHistory() to route, since
  // its a componenet and therefore will not have the default react-router-dom's props
  // like history, location, match(then match.params etc) etc

  const handleClick = (e) => {
    // console.log(e.key);
    setActiveLink(e.key);
  };

  const logout = () => {
    // Logout from firebase
    firebase.auth().signOut();

    // logout from redux
    dispatch({
      type: LOGOUT,
      payload: null,
    });

    // redirect to login page
    history.push('/login');
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[activeLink]} mode="horizontal">
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to="/cart">
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Item>
      )}

      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}

      {user && (
        <SubMenu
          key="SubMenu"
          icon={<SettingOutlined />}
          title={user.email && user.email.split('@')[0]}
          className="float-right"
        >
          {user && user.role === 'subscriber' && (
            <Item key="setting:1">
              <Link to="/user/dashboard">Dashboard</Link>
            </Item>
          )}
          {user && user.role === 'admin' && (
            <Item key="setting:1">
              <Link to="/admin/dashboard">Dashboard</Link>
            </Item>
          )}
          <Item icon={<UserOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}
      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
