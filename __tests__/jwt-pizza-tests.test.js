const request = require('supertest');
const app = require('../src/service'); // Ensure this module properly exports the Express app

// Jest Mocks for MySQL, bcrypt, and JWT before they are used
jest.mock('mysql2/promise');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { DB } = require('../src/database/database'); // DB here is presumed to be an instance, not a class.

describe('Service API Tests', () => {
  describe('GET /', () => {
    it('should return the welcome message and version', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'welcome to JWT Pizza');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('API Routes', () => {
    it('should return documentation on the /api/docs endpoint', async () => {
      const res = await request(app).get('/api/docs');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('endpoints');
      expect(res.body).toHaveProperty('config');
    });

    it('should allow access to the /api/auth route', async () => {
      const res = await request(app).get('/api/auth');
      expect(res.statusCode).toBeLessThan(500);
    });

    it('should allow access to the /api/order route', async () => {
      const res = await request(app).get('/api/order');
      expect(res.statusCode).toBeLessThan(500);
    });

    it('should allow access to the /api/franchise route', async () => {
      const res = await request(app).get('/api/franchise');
      expect(res.statusCode).toBeLessThanOrEqual(500);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app).get('/unknown');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'unknown endpoint');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      const res = await request(app).get('/api/error'); // Make sure your application has this endpoint configured to simulate an error
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message');
    });
  });
});

describe('Database Operations', () => {
  let mockConnection;

  beforeEach(async () => {
    mockConnection = {
      execute: jest.fn().mockResolvedValue([[], {}]),
      query: jest.fn().mockResolvedValue([[], {}]),
      end: jest.fn(),
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
    bcrypt.hash.mockResolvedValue('hashed_password');
    bcrypt.compare.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests for getMenu and addMenuItem are already included.
  // Add the new tests for addUser, getUser, updateUser, loginUser, isLoggedIn, and logoutUser here.

  describe('addUser', () => {
    it('successfully adds a user and handles roles', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        roles: [{ role: 'Admin' }]
      };
      mockConnection.execute.mockResolvedValueOnce([{ insertId: 1 }, {}]);
      const result = await DB.addUser(user);
      expect(result).toEqual({ ...user, id: 1, password: undefined });
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
    });

    it('handles SQL error when adding a user', async () => {
      const user = { name: 'John Doe', email: 'john@example.com', password: 'password123', roles: [{ role: 'Admin' }] };
      mockConnection.execute.mockRejectedValue(new Error('SQL error'));
      await expect(DB.addUser(user)).rejects.toThrow('SQL error');
    });
  });

  describe('getUser', () => {
    it('retrieves a user by email and password', async () => {
      const email = 'john@example.com', password = 'password123';
      mockConnection.execute.mockResolvedValueOnce([[{ id: 1, email, password: 'hashed_password' }], {}]);
      const user = await DB.getUser(email, password);
      expect(user).toEqual({ id: 1, email, roles: [], password: undefined });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashed_password');
    });

    it('throws error for unknown user', async () => {
      const email = 'john@example.com', password = 'password123';
      mockConnection.execute.mockResolvedValueOnce([[], {}]);
      await expect(DB.getUser(email, password)).rejects.toThrow('unknown user');
    });
  });

  describe('updateUser', () => {
    it('updates user details successfully', async () => {
      const userId = 1;
      const email = 'update@example.com';
      const password = 'newPassword123';
      bcrypt.hash.mockResolvedValue('newHashedPassword');
      // Mock the database responses for user update and retrieval
      mockConnection.execute
        .mockResolvedValueOnce([{ affectedRows: 1 }, {}])  // Simulate update success
        .mockResolvedValueOnce([[{ id: userId, email, password: 'newHashedPassword' }], {}])  // Simulate user retrieval after update
        .mockResolvedValueOnce([[{ role: 'Admin' }], {}]);  // Simulate role retrieval
  
      const result = await DB.updateUser(userId, email, password);
      expect(result).toEqual({ id: userId, email, roles: [{ role: 'Admin' }], password: undefined });
    });
  });
  

  describe('loginUser', () => {
    it('logs a user in by setting a token', async () => {
      const userId = 1;
      const token = 'validToken123';
      mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }, {}]);

      await DB.loginUser(userId, token);
      expect(mockConnection.execute).toHaveBeenCalledWith('INSERT INTO auth (token, userId) VALUES (?, ?)', [expect.any(String), userId]);
    });
  });

  // describe('isLoggedIn', () => {
  //   it('returns true if the user is logged in', async () => {
  //     const token = 'validToken123';
  //     mockConnection.execute.mockResolvedValue([[{ userId: 1 }], {}]); // Token found
  
  //     const isLoggedIn = await DB.isLoggedIn(token);
  //     expect(isLoggedIn).toBe(true);
  //     expect(mockConnection.execute).toHaveBeenCalledWith('SELECT userId FROM auth WHERE token=?', [token]);
  //   });
  // });
  

    it('returns false if the token does not exist', async () => {
      const token = 'invalidToken123';
      mockConnection.execute.mockResolvedValue([[], {}]); // No token found

      const isLoggedIn = await DB.isLoggedIn(token);
      expect(isLoggedIn).toBe(false);
    });
  });
  // describe('logoutUser', () => {
  //   it('removes a user\'s token to log them out', async () => {
  //     const token = 'validToken123';
  //     mockConnection.execute.mockResolvedValue([{ affectedRows: 1 }, {}]);
  
  //     await DB.logoutUser(token);
  //     expect(mockConnection.execute).toHaveBeenCalledWith('DELETE FROM auth WHERE token=?', [token]);
  //   });
  // });
  
    
