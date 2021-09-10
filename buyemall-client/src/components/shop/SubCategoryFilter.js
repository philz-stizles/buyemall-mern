import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useDispatch } from 'react-redux';

const SubCategoryFilter = ({ subs, resetFilters, filterProducts }, ref) => {
  const [sub, setSub] = useState(null);
  const dispatch = useDispatch();
  
  useImperativeHandle(ref, () => ({
    reset() {
      setSub(null)
    }
  }))

  const handleSub = (sub) => {
    console.log(sub, typeof sub)
    dispatch({
      type: 'SEARCH_QUERY',
      payload: '',
    });
    resetFilters()
    setSub(sub);
    filterProducts({ sub });
  };

  const showSubs = () =>
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: 'pointer' }}
      >
        {s.name}
      </div>
    ));
  return (
    <div style={{ margin: '10px 0' }} className="pl-4 pr-4">
      {showSubs()}
    </div>
  )
}

export default forwardRef(SubCategoryFilter)
