// src/routes/users.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const router = express.Router();


/** 사용자 회원가입 API 리팩토링**/
const signupSchema = Joi.object({
  nickname: Joi.string().min(3).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required(),
  password:Joi.string().min(4).custom((value, helpers) => {
    const nickname = helpers.root._original.nickname;
    if (value.includes(nickname)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required(),
  confirm: Joi.string().valid(Joi.ref('password')).required(),
});

router.post('/sign-up', async (req, res, next) => {
  try{

  const validation = await signupSchema.validateAsync(req.body);
  const { nickname, password } = validation;
  const isExistUser = await prisma.users.findFirst({
    where: {
      nickname,
    },
  });

  if (isExistUser) {
    return res.status(409).json({ errMessage: '중복된 닉네임입니다.' });
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
  console.log(err.message);
  let errSubject=err.message.split(' ')[0]
  if (errSubject === '"nickname"'){
    return res.status(412).json({ errMessage: "닉네임의 형식이 일치하지 않습니다." });
  }else if(err.message==='"confirm" must be [ref:password]'){
    return res.status(412).json({errMessage:"패스워드가 일치하지 않습니다."})
  }
  else if(errSubject ==='"password"'){
    if(err.message.includes('failed custom validation')){
      return res.status(412).json({errMessage:"패스워드에 닉네임이 포함되어 있습니다."})
    }
    return res.status(412).json({ errMessage: "패스워드의 형식이 일치하지 않습니다." });
  }

  return res.status(400).json({errMessage: "요청한 데이터 형식이 올바르지 않습니다."})
}
});

// src/routes/users.route.js

/** 로그인 API **/
router.post('/log-in', async (req, res, next) => {
  try{
  const { nickname, password } = req.body;
  const user = await prisma.users.findFirst({ where: { nickname } });

  if (!user || !(await bcrypt.compare(password, user.password))){
    return res.status(412).json({message:"닉네임 또는 패스워드를 확인해주세요"})
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
  return res.status(200).json({ "token": `${partOfToken}......` });

  }catch(err){
    console.log(err);
    res.status(400).json({message : '로그인에 실패하였습니다.'});
  }
});

export default router;