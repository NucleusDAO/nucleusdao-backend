const request = require('supertest');
const app = require('../app.js');

describe('Authentication Endpoints', () => {
  // Register
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: '123456',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  // Login
  it('should authenticate a user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: '123456',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should redirect to Google Auth', async () => {
    const res = await request(app).get('/auth/google');
    expect(res.statusCode).toBe(302); // Should redirect to google 
  });

  // Logout
  it('should log out a user', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User logged out successfully');
  });

  it('should initiate password reset process', async () => {
    const res = await request(app)
      .post('/auth/forgot-password')
      .send({
        email: 'test@example.com',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Password reset email sent');
  });
});

