const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { DB, Role } = require('../src/database/database');  // Adjust the path as necessary
const config = require('../src/config');
const { authRouter, setAuthUser } = require('../src/routes/authRouter');  // Adjust the path as necessary

jest.mock('../src/database/database', () => ({
  DB: {
    addUser: jest.fn(),
    getUser: jest.fn(),
    isLoggedIn: jest.fn(),
    loginUser: jest.fn(),
    logoutUser: jest.fn(),
    updateUser: jest.fn()
  },
  Role: {
    Admin: 'admin',
    Diner: 'diner'
  }
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

const app = express();
app.use(express.json());
app.use(setAuthUser); // Ensuring the auth middleware is included in the tests
app.use('/api/auth', authRouter);

describe('Authentication Routes', () => {
  beforeEach(() => {
    jwt.sign.mockClear();
    jwt.verify.mockClear();
    DB.addUser.mockClear();
    DB.getUser.mockClear();
    DB.isLoggedIn.mockClear();
    DB.loginUser.mockClear();
    DB.logoutUser.mockClear();
    DB.updateUser.mockClear();
  });

  describe('POST /', () => {
    it('should register a new user and return a token', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123', roles: [{ role: Role.Diner }] };
      const token = 'testtoken123';
      DB.addUser.mockResolvedValue(userData);
      jwt.sign.mockReturnValue(token);

      const response = await request(app).post('/api/auth').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(DB.addUser).toHaveBeenCalledWith({...userData, roles: [{ role: Role.Diner }]});
      expect(jwt.sign).toHaveBeenCalledWith(userData, config.jwtSecret);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: userData, token });
    });
  });

  describe('PUT /', () => {
    it('should login an existing user and return a token', async () => {
      const userData = { id: 1, name: 'Existing User', email: 'user@example.com', password: 'securepassword', roles: [{ role: Role.Admin }] };
      const token = 'testtoken123';
      DB.getUser.mockResolvedValue(userData);
      jwt.sign.mockReturnValue(token);

      const response = await request(app).put('/api/auth').send({
        email: 'user@example.com',
        password: 'securepassword'
      });

      expect(DB.getUser).toHaveBeenCalledWith('user@example.com', 'securepassword');
      expect(jwt.sign).toHaveBeenCalledWith(userData, config.jwtSecret);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: userData, token });
    });
  });

//   describe('DELETE /', () => {
//     it('should log out a user', async () => {
//       const token = 'testtoken123';
//       DB.logoutUser.mockResolvedValue(true);

//       const response = await request(app)
//         .delete('/api/auth')
//         .set('Authorization', `Bearer ${token}`);

//       expect(DB.logoutUser).toHaveBeenCalledWith(token);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual({ message: 'logout successful' });
//     });
//   });

//   describe('PUT /:userId', () => {
//     it('should update an existing user', async () => {
//       const userData = { id: 1, name: 'Updated User', email: 'updated@example.com', password: 'newpassword', roles: [{ role: Role.Admin }] };
//       const userId = 1;
//       const token = 'validtoken123';
//       DB.updateUser.mockResolvedValue(userData);
//       jwt.verify.mockReturnValue({ id: userId, roles: [{ role: Role.Admin }] });

//       const response = await request(app)
//         .put(`/api/auth/${userId}`)
//         .send({ email: 'updated@example.com', password: 'newpassword' })
//         .set('Authorization', `Bearer ${token}`);

//       expect(DB.updateUser).toHaveBeenCalledWith(userId, 'updated@example.com', 'newpassword');
//       expect(jwt.verify).toHaveBeenCalledWith(token, config.jwtSecret);
//       expect(response.status).toBe(200);
//       expect(response.body).toEqual(userData);
//     });
//   });
});
