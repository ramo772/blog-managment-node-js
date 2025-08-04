const request = require('supertest');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const { Blog } = require('../../models/blog');

let server;

describe('/api/blogs', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => {
    await server.close();
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all blogs', async () => {
      const blogs = [
        { title: 'blog1', content: 'This is a test blog content.', category: ['Test Category'], userId: new mongoose.Types.ObjectId() },
        { title: 'blog2', content: 'This is another test blog content.', category: ['Test Category'], userId: new mongoose.Types.ObjectId() },
      ];

      await Blog.collection.insertMany(blogs);
      const res = await request(server).get('/api/blogs');
      const { status, body } = res;
      const { docs } = body.data.blogs;
      expect(status).toBe(200);
      expect(docs.length).toBe(2);
      expect(docs.some(b => b.title === 'blog1')).toBeTruthy();
      expect(docs.some(b => b.title === 'blog2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a blog if valid id is passed', async () => {
      const blog = new Blog({
        title: 'blog1',
        content: 'This is a test blog content.',
        category: ['Test Category'],
        userId: new mongoose.Types.ObjectId()
      });
      await blog.save();

      const res = await request(server).get('/api/blogs/' + blog._id);

      expect(res.status).toBe(200);
      expect(res.body.data.blog).toHaveProperty('title', blog.title);
      expect(res.body.data.blog).toHaveProperty('content', blog.content);
      expect(res.body.data.blog).toHaveProperty('category', blog.category);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/blogs/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no blog with the given id exists', async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get('/api/blogs/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    // Define the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the title of the 
    // test. 
    let token;
    let title;
    let content;
    let category;
    let userId;
    const exec = async () => {
      return await request(server)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({
          title,
          content,
          category,
          userId
        });
    }

    beforeEach(async () => {
      title = 'blog1';
      content = 'This is a test blog content.';
      category = ['Test Category'];
      const user = new User({ name: 'Test User', email: 'test2@example.com', password: 'Wesdwesd!@333' });
      await user.save();

      token = user.generateAuthToken();
      userId = user._id;
    })



    it('should return 400 if blog title is less than 5 characters', async () => {
      title = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if blog title is more than 50 characters', async () => {
      title = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the blog if it is valid', async () => {
      await exec();

      const blog = await Blog.find({ title: 'blog1' });

      expect(blog).not.toBeNull();
    });

    it('should return the blog if it is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(201);
      expect(res.body.data.blog).toHaveProperty('_id');
      expect(res.body.data.blog).toHaveProperty('title', title);
    });
  });

  describe('PUT /:id', () => {
    let token;
    let newTitle;
    let blog;
    let id;

    const exec = async () => {
      return await request(server)
        .put('/api/blogs/' + id)
        .set('x-auth-token', token)
        .send({ title: newTitle });
    }

    beforeEach(async () => {
      user = new User({ name: 'Test User', email: 'test2@example.com', password: 'Wesdwesd@123' });
      await user.save();

      token = user.generateAuthToken();
      blog = new Blog({ title: 'blog1', content: 'This is a test blog content.', category: ['Test Category'], userId: user._id });
      await blog.save();

      id = blog._id;
      newTitle = 'updatedName';
    })

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if blog is less than 5 characters', async () => {
      newTitle = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if blog is more than 50 characters', async () => {
      newTitle = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();
      console.log('Response Body:', res); // Debugging log
      expect(res.status).toBe(404);
    });

    it('should return 404 if blog with the given id was not found', async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should update the blog if input is valid', async () => {
      await exec();

      const updatedBlog = await Blog.findById(blog._id);
      expect(updatedBlog.title).toBe(newTitle);
    });

    it('should return the updated blog if it is valid', async () => {
      const res = await exec();
      expect(res.body.data.updatedBlog).toHaveProperty('_id');
      expect(res.body.data.updatedBlog).toHaveProperty('title', newTitle);
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let blog;
    let id;
    let userId;
    let title;
    let content;
    let category;
    const exec = async () => {
      return await request(server)
        .delete('/api/blogs/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      const user = new User({ name: 'Test User', email: 'test2@example.com', password: 'Wesdwesd@123' });
      await user.save();

      token = user.generateAuthToken();
      blog = new Blog({ title: 'blog title', content: 'This is a test blog content.', category: ['Test Category'], userId: user._id });
      await blog.save();

      id = blog._id;
    })

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no blog with the given id was found', async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the blog if input is valid', async () => {
      await exec();

      const blogInDb = await Blog.findById(id);

      expect(blogInDb).toBeNull();
    });

  });
});