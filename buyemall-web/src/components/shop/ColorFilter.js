import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { useDispatch } from 'react-redux';
import { Radio } from 'antd';

const ColorFilter = ({ resetFilters, filterProducts }, ref) => {
  const [colors, setColors] = useState([
    'Black',
    'Brown',
    'Silver',
    'White',
    'Blue',
  ]);
  const [color, setColor] = useState('');
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    reset() {
      setColor('')
    }
  }))

  const handleColor = (e) => {
    dispatch({
      type: 'SEARCH_QUERY',
      payload: '',
    });
    resetFilters()
    setColor(e.target.value);
    filterProducts({ color: e.target.value });
  };

  const showColors = () =>
    colors.map((c) => (
      <Radio
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ));

  return (
      <div style={{ margin: '10px 0' }} className="pr-5">
      {showColors()}
      </div>
  )
}

export default forwardRef(ColorFilter)
