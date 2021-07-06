const uuidV4 = require('uuid').v4;
const { generateToken } = require('../../src/utils/auth.utils');

describe('Authentication utilities', () => {
  describe('generateToken', () => {
    it('should return token', () => {
      const mockUser = { _id: uuidV4() };
      const result = generateToken(mockUser);
      expect(result).toBeTruthy();
    });
  });
});
