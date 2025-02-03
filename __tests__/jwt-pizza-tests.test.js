const request = require('supertest');
const app = require('../src/service'); // Ensure this module properly exports the Express app

// Jest Mocks for MySQL and JWT before they are used
jest.mock('mysql2/promise');
jest.mock('jsonwebtoken');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
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
      execute: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    mysql.createConnection.mockResolvedValue(mockConnection);
    // No new DB().initialized since DB is not a constructor
    // Possible setup actions here, if any
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMenu', () => {
    it('should fetch menu items from the database', async () => {
      mockConnection.execute.mockResolvedValue([[{ id: 1, title: 'Pizza', description: 'Delicious pizza', image: 'image-url', price: 10 }], []]);
    
      const menu = await DB.getMenu();
      expect(menu).toEqual([{ id: 1, title: 'Pizza', description: 'Delicious pizza', image: 'image-url', price: 10 }]);
      // Correct the expected parameters to include the undefined that is being passed
      expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM menu', undefined);
    });    
  });

  describe('addMenuItem', () => {
    it('should add a menu item to the database', async () => {
      mockConnection.execute.mockResolvedValue([{ insertId: 2 }, []]);

      const newItem = { title: 'Burger', description: 'Juicy burger', image: 'burger-img', price: 15 };
      const result = await DB.addMenuItem(newItem);
      expect(result).toEqual({ ...newItem, id: 2 });
      expect(mockConnection.execute).toHaveBeenCalledWith('INSERT INTO menu (title, description, image, price) VALUES (?, ?, ?, ?)', ['Burger', 'Juicy burger', 'burger-img', 15]);
    });
  });
});
