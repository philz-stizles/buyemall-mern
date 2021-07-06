const uuidV4 = require('uuid').v4;
const { filterRequestBody } = require('../../src/utils/auth.utils');

describe('API utilities', () => {
  describe('filterRequestBody', () => {
    it('should return token', () => {
      const mockUser = { _id: uuidV4() };
      const result = filterRequestBody(mockUser);
      expect(result).toBeTruthy();
    });
  });
});
