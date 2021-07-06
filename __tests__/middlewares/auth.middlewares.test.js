const { authenticate } = require('../../src/middlewares/auth.middlewares');

let mockReq;
let mockRes;
let mockNext; //

beforeAll(() => {
  mockReq = {
    get() {
      return null;
    },
  };
  mockRes = {};
  mockNext = () => {};
});

beforeEach(() => {});

describe('Authentication middleware', () => {
  describe('Authenticate', () => {
    it('should throw an error if no authorization header is present', async () => {
      expect(authenticate(mockReq, mockRes, mockNext)).toThrowError(
        'You are not logged in. Please log'
      );
    });
  });

  describe('Authorize', () => {});
});
