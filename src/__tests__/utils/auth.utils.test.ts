import { v4 as uuidV4 } from 'uuid';
import { generateToken } from '../../utils/authUtils';

describe('Authentication utilities', () => {
  describe('generateToken', () => {
    it('should return token', () => {
      const mockUser = { _id: uuidV4() };
      const result = generateToken(mockUser);
      expect(result).toBeTruthy();
    });
  });
});
