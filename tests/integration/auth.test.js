const { User } = require('../../models/user');
const { Blog } = require('../../models/blog');
const request = require('supertest');

describe('auth middleware', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();

    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  let token;
  let user;
  const exec = () => {
    return request(server)
      .post('/api/blogs')
      .set('x-auth-token', token)
      .send({ title: 'blog title', content: 'blog content', category: 'category', userId: user._id });
  }

  beforeEach(async() => {
    user = new User({ name: 'Test User', email: 'test2@example.com', password: 'Password123!' });
    await user.save();
    token = user.generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 201 that the blog created if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });
});