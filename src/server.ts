import 'dotenv/config';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';
import { join } from 'node:path';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const config = {
  port: process.env['PORT'] || 4000,
  jwtSecret: process.env['JWT_SECRET']!,
  databaseUrl: process.env['MONGODB_URI']!,
};

mongoose
  .connect(config.databaseUrl, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error');
    console.error(err.message);
  });

const UserSchema = new mongoose.Schema({
  login: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  image: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User =
  mongoose.models['User'] || mongoose.model('User', UserSchema);

const Post =
  mongoose.models['Post'] || mongoose.model('Post', PostSchema);

const Comment =
  mongoose.models['Comment'] || mongoose.model('Comment', CommentSchema);

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*  USER */

app.post('/api/user/create', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const exists = await User.findOne({ login: email });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      login: email,
      email,
      name,
      password: hash,
    });

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/user/auth', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, login: user.login },
      config.jwtSecret,
      { expiresIn: '2h' }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Auth failed' });
  }
});

/* AUTH MIDDLEWARE  */

const authMiddleware = (req: any, res: any, next: any) => {
  const header = req.headers['x-auth-token'];
  if (!header) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const token = header.replace('Bearer ', '');
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/*  POST */

app.get('/api/posts', async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  return res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(post);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

app.post('/api/posts', authMiddleware, async (req: any, res) => {
  const { title, text, image } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const post = await Post.create({
    title,
    text,
    image,
    author: req.user.login,
  });

  return res.status(201).json(post);
});

app.put('/api/posts/:id', authMiddleware, async (req: any, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author !== req.user.login) {
      return res.status(403).json({ error: 'No permission' });
    }

    post.title = req.body.title;
    post.text = req.body.text;
    post.image = req.body.image;

    await post.save();
    return res.json(post);
  } catch {
    return res.status(500).json({ error: 'Update failed' });
  }
});

app.delete('/api/posts/:id', authMiddleware, async (req: any, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author !== req.user.login) {
      return res.status(403).json({ error: 'No permission' });
    }

    await post.deleteOne();
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Delete failed' });
  }
});

/*СOMMENTS */

app.get('/api/comments/:postId', async (req, res) => {
  try {
    const comments = await Comment
      .find({ postId: req.params.postId })
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ error: 'Load comments failed' });
  }
});

app.post('/api/comments', authMiddleware, async (req: any, res) => {
  try {
    const { postId, text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Empty comment' });
    }

    const comment = await Comment.create({
      postId,
      text,
      author: req.user.login
    });

    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ error: 'Add comment failed' });
  }
});

app.delete('/api/comments/:id', authMiddleware, async (req: any, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author !== req.user.login) {
      return res.status(403).json({ error: 'No permission' });
    }

    await comment.deleteOne();
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Delete failed' });
  }
});

/* SSR  */

const browserDistFolder = join(import.meta.dirname, '../browser');

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(response =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  app.listen(config.port, error => {
    if (error) throw error;
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);