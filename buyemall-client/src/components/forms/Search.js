import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { text } = useSelector((state) => state.search);

  const handleChange = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop?${text}`);
  };

  return (
    <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        type="search"
        value={text}
        className="form-control mr-sm-2"
        placeholder="Search"
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: 'pointer' }} />
    </form>
  );
};

export default Search;
