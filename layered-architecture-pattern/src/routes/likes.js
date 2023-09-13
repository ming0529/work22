// src/routes/posts.router.js

import express from 'express';
import { LikeController } from '../controllers/like.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const likeController = new LikeController();

/** 게시글 좋아요 API **/
router.put('/:postId/like',authMiddleware, likeController.createLike);

/** 게시글 상세 조회 API **/
router.get('/like',authMiddleware, likeController.getLikePosts);

export default router;