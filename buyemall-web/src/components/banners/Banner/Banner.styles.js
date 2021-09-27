import styled from 'styled-components';

export const BannerWrapper = styled.div`
  display: flex;
  padding: 2rem;
  background-color: #a435f0;
  color: #fff;

  .content-area {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .close-area {
    i {
      font-size: 1.6rem;
    }
  }
`;
