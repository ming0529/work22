// src/routes/posts.router.js

import express from 'express';
import { UserController } from '../controllers/user.js';

import validate from '../middleware/validation.js';
import Schemas from '../utils/joi.js';
const {signupSchema}  = Schemas;

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const userController = new  UserController();

/** 사용자 회원가입 API **/
router.post('/sign-up',  validate(signupSchema), userController.createUser);

/** 로그인 API **/
router.put('/log-in', userController.authenticateUser);


export default router;