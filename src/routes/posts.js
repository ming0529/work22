// routes/posts.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import Schemas from '../utils/joi.js';
import Joi from 'joi';
import { CustomError } from '../err.js';
const {postSchema}  = Schemas; 

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

/** 게시글 생성 API **/
router.post('/', authMiddleware,validate(postSchema), async (req, res, next) => {
  try{
  const { title, content } = req.validatedData;
  const { userId } = req.user;

  const post = await prisma.posts.create({
    data: {
      UserId: userId,
      title,
      content,
    },
  });
  return res.status(201).json({ message: "게시글 작성에 성공하였습니다" });

}catch(err){
  console.log(err);
  next(new CustomError(400,"게시글 작성에 실패하였습니다."));
}
});

// routes/posts.router.js
/** 게시글 목록 조회 API **/
router.get('/', async (req, res, next) => {
  try{
  let posts = await prisma.posts.findMany({
    select: {
      postId: true,
      UserId : true,
      title: true,
      createdAt: true,
      updatedAt: true,
      User : {
        select: {
          nickname: true, // 작성자의 닉네임 필드만 선택합니다.
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // 게시글을 최신순으로 정렬합니다.
    },
  });

  posts = posts.map((x)=>{
    return {
      postId: x.postId,
      UserId: x.UserId,
      title: x.title,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
      nickname : x.User.nickname,
    }
  })

  return res.status(200).json({ posts: posts });
}catch(err){
  console.log(err);
  next(new CustomError(400,'게시글 목록조회에 실패하였습니다.'));
}
});

// routes/posts.router.js

/** 게시글 상세 조회 API **/
router.get('/:postId', async (req, res, next) => {
  try{
  const { postId } = req.params;
  let post = await prisma.posts.findFirst({
    where: {
      postId: +postId,
    },
    select: {
      postId: true,
      UserId: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      User : {
        select: {
          nickname: true, // 작성자의 닉네임 필드만 선택합니다.
        },
      },
    },
  });

    post =  {
        postId: post.postId,
        UserId: post.UserId,
        title: post.title,
        content : post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        nickname : post.User.nickname,
      }

  return res.status(200).json({ post: post });
}catch(err){
  console.log(err);
  next(new CustomError(400,'게시글 상세조회에 실패하였습니다.'));
}
});

// routes/posts.router.js

const postUpdateSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});


/** 게시글 수정 API 여기부터 수정하기 **/
router.put('/:postId', authMiddleware,validate(postSchema), async (req, res, next) => {
  try{
  const {postId}= req.params;
  const { userId } = req.user;

  const post = await prisma.posts.findUnique({
    where: { postId: +postId },
    select: {
      UserId : true,
      User : {
        select: {
          password: true, // 작성자의 닉네임 필드만 선택합니다.
        },
      },
    },

  });

  if (!post){
    throw new CustomError(404,"수정할 게시글 조회에 실패하였습니다.")
  }

 if(post.UserId !==userId ) {
  throw new CustomError(403,"게시글의 수정권한이 존재하지 않습니다.")
 }

  const { title, content } =req.validatedData;


  const result = await prisma.posts.update({
    data: { title, content },
    where: {
      postId: +postId,
    },
  });
//수정실패시 null이 result에 들어감
  if(!result){
    throw new CustomError(401,"게시글이 정상적으로 수정되지 않았습니다.")
  }

  return res.status(200).json({ data: '게시글을 수정하였습니다.' });
}

catch(err){
  console.log(err);
  if(err instanceof CustomError){
    next(err);
  }else {next(new CustomError(400,"게시글 수정에 실패하였습니다."))}
}
});

// routes/posts.router.js

/** 게시글 삭제 API **/
router.delete('/:postId',authMiddleware, async (req, res, next) => {
  try{
  const { postId } = req.params;
  const { userId } = req.user;

  const post = await prisma.posts.findFirst({ where: { postId: +postId } });

  if (!post){
    throw new CustomError(404,"게시글이 존재하지 않습니다.")
  }
  
  if(post.UserId !==userId) {
    throw new CustomError(403,"게시글의 삭제 권한이 존재하지 않습니다.")
  }

  let result = await prisma.posts.delete({ where: { postId: +postId } });
  if(!result){
    throw new CustomError(401,"게시글이 정상적으로 삭제되지 않았습니다.")
  } 
  return res.status(200).json({ data: '게시글을 삭제하였습니다.' });

}catch(err){
  console.log(err);
  if(err instanceof CustomError){
    next(err);
  }else {next(new CustomError(400,"게시글 삭제에 실패하였습니다."))}
}
});



export default router;