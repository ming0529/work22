import express from 'express';
import { CommentsController } from '../controllers/comments.js';
import authMiddleware from '../middleware/auth.js';

import validate from '../middleware/validation.js';
import Schemas from '../utils/joi.js';
const {commentSchema}  = Schemas;

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const commentsController = new CommentsController();

/** 댓글 조회 API **/
router.get('/', commentsController.getComments);

/** 댓글 작성 API **/
router.post('/', authMiddleware, validate(commentSchema), commentsController.createComment);

/** 댓글 수정 API **/
router.put('/:commentId', authMiddleware, validate(commentSchema), commentsController.updateComment);

/** 댓글 삭제 API **/
router.delete('/:commentId', authMiddleware, commentsController.deleteComment);

export default router;