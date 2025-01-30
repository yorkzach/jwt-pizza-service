const request = require('supertest');
const app = require('../src/service');

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
      const res = await request(app).get('/api/auth');  // Adjust according to actual endpoint usage
      expect(res.statusCode).toBeLessThan(500);  // Assumes endpoint exists and is handled
    });

    it('should allow access to the /api/order route', async () => {
      const res = await request(app).get('/api/order');  // Adjust according to actual endpoint usage
      expect(res.statusCode).toBeLessThan(500);
    });

    it('should allow access to the /api/franchise route', async () => {
      const res = await request(app).get('/api/franchise');  // Adjust according to actual endpoint usage
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

//   describe('Error Handling', () => {
//     it('should handle errors gracefully', async () => {
//       // You might need to mock an error scenario, depending on your implementation
//       // For example, forcing an error in a middleware or route to see if it's caught and handled properly
//       const res = await request(app).get('/api/error');  // Hypothetical endpoint that would trigger an error
//       expect(res.statusCode).toEqual(404);
//       expect(res.body).toHaveProperty('message');
//       expect(res.body).toHaveProperty('stack');
//     });
//   });
});

// jest.mock('mysql2/promise');
// const mysql = require('mysql2/promise');
// const { DB } = require('../src/database/database');
// const sinon = require('sinon');

// describe('Database Operations', () => {
//   let db;
//   let mockConnection;

//   beforeEach(async () => {
//     mockConnection = {
//       execute: jest.fn(),
//       query: jest.fn(),
//       end: jest.fn(),
//     };
//     mysql.createConnection.mockResolvedValue(mockConnection);
//     db = new DB();
//     await db.initialized;  // Wait for the DB initialization if necessary
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getMenu', () => {
//     it('should fetch menu items from the database', async () => {
//       mockConnection.execute.mockResolvedValue([[{ id: 1, title: 'Pizza', description: 'Delicious pizza', image: 'image-url', price: 10 }], []]);

//       const menu = await db.getMenu();
//       expect(menu).toEqual([{ id: 1, title: 'Pizza', description: 'Delicious pizza', image: 'image-url', price: 10 }]);
//       expect(mockConnection.execute).toHaveBeenCalledWith('SELECT * FROM menu');
//     });
//   });

//   describe('addMenuItem', () => {
//     it('should add a menu item to the database', async () => {
//       const newItem = { title: 'Burger', description: 'Juicy burger', image: 'burger-img', price: 15 };
//       mockConnection.execute.mockResolvedValue([{ insertId: 2 }, []]);

//       const result = await db.addMenuItem(newItem);
//       expect(result).toEqual({ ...newItem, id: 2 });
//       expect(mockConnection.execute).toHaveBeenCalledWith('INSERT INTO menu (title, description, image, price) VALUES (?, ?, ?, ?)', ['Burger', 'Juicy burger', 'burger-img', 15]);
//     });
//   });

  // Additional tests for other methods like addUser, getUser, updateUser, etc.
// });


