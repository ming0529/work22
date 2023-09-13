// src/routes/posts.router.js

import express from 'express';
import { PostsController } from '../controllers/posts.js';
import authMiddleware from '../middleware/auth.js';
import { prisma } from '../utils/prisma/index.js';

import validate from '../middleware/validation.js';
import Schemas from '../utils/joi.js';
const {postSchema}  = Schemas;

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const postsController = new PostsController();

/** 게시글 조회 API **/
router.get('/', postsController.getPosts);

/** 게시글 상세 조회 API **/
router.get('/:postId', postsController.getPostById);

/** 게시글 작성 API **/
router.post('/', authMiddleware, validate(postSchema), postsController.createPost);

/** 게시글 수정 API **/
router.put('/:postId', authMiddleware, validate(postSchema), postsController.updatePost);

/** 게시글 삭제 API **/
router.delete('/:postId', authMiddleware, postsController.deletePost);

export default router;