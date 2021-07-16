import request from 'supertest';
// import mongoose from 'mongoose';
import app from '../../../app';

describe('Create category route', () => {
  it('has a route handler listening to /api/v1/categories for post requests', async () => {
    const response = await request(app).post('/api/v1/categories').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).post('/api/v1/categories').send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const token = await global.signinWithToken();
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid name is provided', async () => {
    const token = await global.signinWithToken();
    await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);
    await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' })
      .expect(400);
  });

  it('creates a new category', async () => {
    const token = await global.signinWithToken();
    const { body } = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test name' })
      .expect(201);

    expect(body).toBeDefined();
    expect(body.status).toBeDefined();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.message).toBeDefined();
  });
});
