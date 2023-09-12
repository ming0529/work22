// src/routes/users.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import validate from '../middleware/validation.js';
import Schemas from '../utils/joi.js';
import { CustomError } from '../err.js';
const {signupSchema}  = Schemas; 

const router = express.Router();


/** 사용자 회원가입 API 리팩토링**/

router.post('/sign-up',validate(signupSchema), async (req, res, next) => {
  try{
   const { nickname, password } =req.validatedData;

  const isExistUser = await prisma.users.findFirst({
    where: {
      nickname,
    },
  });

  if (isExistUser) {
    throw new CustomError(409,'중복된 닉네임입니다.')
  }
 
  // 사용자 비밀번호를 암호화합니다.
  const hashedPassword = await bcrypt.hash(password, 10);

  // Users 테이블에 사용자를 추가합니다.
  const user = await prisma.users.create({
    data: {
      nickname,
      password: hashedPassword, // 암호화된 비밀번호를 저장합니다.
    },
  });

  return res.status(201).json({ message: '회원가입에 성공하였습니다.' });
}catch(err){
 next(new CustomError(400, '회원가입에 실패하였습니다.'));
}
});

// src/routes/users.route.js

/** 로그인 API **/
router.post('/log-in', async (req, res, next) => {
  try{
  const { nickname, password } = req.body;
  const user = await prisma.users.findFirst({ where: { nickname } });

  if (!user || !(await bcrypt.compare(password, user.password))){
    throw new CustomError(412,"닉네임 또는 패스워드를 확인해주세요.")
  }
  // 로그인에 성공하면, 사용자의 userId를 바탕으로 토큰을 생성합니다. userid로 만드는게 나아 아니면 닉네임으로 만드는게 나아? 
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    'customized_secret_key',
  );
  // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장합니다.
  res.cookie('authorization', `Bearer ${token}`);
  let partOfToken = token.slice(0,10);
  return res.status(200).json({ "token": `로그인성공 토큰은 ${partOfToken}......` });

  }catch(err){
    console.log(err);
    if(err instanceof CustomError){
      next(err);
  }
    next(new CustomError(400,"로그인에 실패하였습니다."))
}
});

export default router;