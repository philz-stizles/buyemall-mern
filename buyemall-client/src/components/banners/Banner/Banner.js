import React from 'react';
import { BannerWrapper } from './Banner.styles';

const Banner = ({ message, color, icon, onClick }) => {
  return (
    <BannerWrapper color={color}>
      <div className="content-area">{message}</div>
      <div className="close-area">
        <button className="btn-plain" onClick={onClick}>
          <i className="la la-close" />
        </button>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
