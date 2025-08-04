const bcrypt = require('bcrypt');
const userRepository = require('../../../repositories/userRepository');
const userService = require('../../../services/userService');

jest.mock('../../../repositories/userRepository');
jest.mock('bcrypt');

describe('Auth Service', () => {
  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'plainPassword123'
  };

  describe('createUser', () => {
    it('should create a new user and return token', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        ...mockUserData,
        save: jest.fn(),
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      });
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const {  token } = await userService.createUser(mockUserData);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: mockUserData.email });
      expect(userRepository.create).toHaveBeenCalled();
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 'salt');
      expect(token).toBe('mockToken');
    });

    it('should throw error if user exists', async () => {
      userRepository.findOneBy.mockResolvedValue({ email: mockUserData.email });

      await expect(userService.createUser(mockUserData)).rejects.toThrow('User already registered.');
    });
  });

  describe('loginUser', () => {
    it('should login and return token if credentials are valid', async () => {
      const mockUser = {
        ...mockUserData,
        password: 'hashedPassword',
        generateAuthToken: jest.fn().mockReturnValue('mockToken')
      };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const { user, token } = await userService.loginUser(mockUserData);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: mockUserData.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(mockUserData.password, mockUser.password);
      expect(token).toBe('mockToken');
    });

    it('should throw error if user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(userService.loginUser(mockUserData)).rejects.toThrow('Invalid email or password.');
    });

    it('should throw error if password is invalid', async () => {
      userRepository.findOneBy.mockResolvedValue({
        ...mockUserData,
        password: 'hashedPassword',
      });
      bcrypt.compare.mockResolvedValue(false);

      await expect(userService.loginUser(mockUserData)).rejects.toThrow('Invalid email or password.');
    });
  });
});
