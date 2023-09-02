// routes/posts.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.



//게시글 생성
router.post('/', async (req, res, next)=>{
  try{
  const {user, password, title, content}= req.body;

  if(!user || !password || !title || !content){
    return res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
  }

  const post = await prisma.posts.create({
    data : {user, password, title, content}
  })
  return res.status(201).json({message : "게시글을 생성하였습니다."})
}catch(err){
  console.log(err);
  next();
}
});


// routes/posts.router.js

/** 게시글 전체 조회 API 날짜는 내림차순**/
router.get('/', async (req, res, next) => {
  try{
  const posts = await prisma.posts.findMany({
    select: {
      postId: true,
      user:true,
      title: true,
      createdAt: true,
    },
    orderBy:{
      createdAt: 'desc'
    }
  });
  if(!posts) return res.status(400).json({message : '게시글이 없습니다.'})

  return res.status(200).json({ data: posts });
}catch(err){
  console.log(err);
  next();
}
});

// routes/posts.router.js

/** 게시글 상세 조회 API**/
router.get('/:postId', async (req, res, next) => {
  try{
  const { postId } = req.params;
  if(!postId) return res.status(400).json({message: '데이터 형식이 올바르지 않습니다.'})
  const post = await prisma.posts.findFirst({
    where: { postId: +postId },
    select: {
      postId: true,
      user:true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if(!post) return res.status(400).json({message:'존재하지 않는 게시물 입니다.'})

  return res.status(200).json({ data: post });
}catch(err){
  console.log(err);
  next();
}
});

// routes/posts.router.js

/** 게시글 수정 API **/
router.put('/:postId', async (req, res, next) => {
  try{
  const { postId } = req.params;
  const { title, content, password } = req.body;
  if(!postId ||!title ||!content||!password) return res.status(400).json({message : "데이터 형식이 올바르지 않습니다."});

  const post = await prisma.posts.findUnique({
    where: { postId: +postId },
  });

  if (!post)
    return res.status(404).json({ message: '수정할 게시글 조회에 실패하였습니다.' });
  else if (post.password !== password)
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

  await prisma.posts.update({
    data: { title, content },
    where: {
      postId: +postId,
      password,
    },
  });
  return res.status(200).json({ data: '게시글을 수정하였습니다.' });
}catch(err){
  console.log(err);
  next();
}
});


// routes/posts.router.js

/** 게시글 삭제 API **/
router.delete('/:postId', async (req, res, next) => {
  const { postId } = req.params;
  const { password } = req.body;
  if(!postId|| !password) {
    return res.status(400).json({message : '데이터 형식이 올바르지 않습니다.'})
  }

  const post = await prisma.posts.findFirst({ where: { postId: +postId } });

  if (!post)
    return res.status(404).json({ message: '삭제할 게시글 조회에 실패하였습니다.' });
  else if (post.password !== password)
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

  await prisma.posts.delete({ where: { postId: +postId } });

  return res.status(200).json({ data: '게시글을 삭제하였습니다.' });
});



export default router;