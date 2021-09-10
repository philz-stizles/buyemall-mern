import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useDispatch } from 'react-redux';
import Star from '../../components/forms/Star';

const RatingFilter = ({ resetFilters, filterProducts }, ref) => {
   const [star, setStar] = useState('');
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    reset() {
      setStar('')
    }
  }))

  const handleStarClick = (num) => {
    // console.log(num);
    dispatch({
      type: 'SEARCH_QUERY',
      payload: '',
    });
    resetFilters()
    filterProducts({ stars: num });
  };

  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  return (
      <div style={{ margin: '10px 0' }}>{showStars()}</div> 
  )
}

export default forwardRef(RatingFilter)
