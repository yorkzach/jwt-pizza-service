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
      expect(res.statusCode).toBeLessThan(500);
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
      // You might need to mock an error scenario, depending on your implementation
      // For example, forcing an error in a middleware or route to see if it's caught and handled properly
      const res = await request(app).get('/api/error');  // Hypothetical endpoint that would trigger an error
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('stack');
    });
  });
});
