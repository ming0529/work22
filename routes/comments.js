import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.


//댓글 생성
router.post('/', async (req, res, next)=>{
    try{
    const postId = req.postId;
    const {user, password, content}= req.body;
  
    if(!content){
        return res.status(400).json({message : "댓글 내용을 입력해주세요"})
    }
    if(!postId||!user||!password){
      return res.status(400).json({message : "데이터 형식이 올바르지 않습니다."})
    }
  
    const comment = await prisma.comments.create({
      data : {postId : +postId, user, password, content}
    })
    return res.status(201).json({message : "댓글을 생성하였습니다."})
  }catch(err){
    console.log(err);
    next(err);
  }
  });

  //댓글 목록 조회
  router.get('/', async (req, res, next) => {
    try{
     const postId = req.postId;
     const comments = await prisma.comments.findMany({
        where: { postId: +postId },
      select: {
        commentId: true,
        user:true,
        content: true,
        createdAt: true,
      },
      orderBy:{
        createdAt: 'desc'
      }
    });
    if(comments.length===0) return res.status(400).json({message : '작성된 댓글이 없습니다.'})
  
    return res.status(200).json({ data: comments });
  }catch(err){
    console.log(err);
    next();
  }
  });

//댓글 수정
router.put('/:commentId', async (req, res, next) => {
    try{
    const postId = req.postId;
    const { commentId } = req.params;
    const { content, password } = req.body;
    if(!content) return res.status(400).json({message : '댓글 내용을 입력해주세요.'});
    if(!postId || !commentId ||!password) return res.status(400).json({message : "데이터 형식이 올바르지 않습니다."});
  
    const comment = await prisma.comments.findUnique({
      where: { postId: +postId, commentId : +commentId},
    });
  
    if (!comment)
      return res.status(404).json({ message: '수정할 댓글이 존재하지 않습니다.' });
    else if (comment.password !== password)
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  
    await prisma.comments.update({
      data: { content },
      where: {
        postId: +postId,
        commentId : +commentId,
        password,
      },
    });
    return res.status(200).json({ data: '댓글을 수정하였습니다.' });
  }catch(err){
    console.log(err);
    next(err);
  }
  });

  //댓글 삭제
  router.delete('/:commentId', async (req, res, next) => {
    try{
    const postId = req.postId;
    const { commentId } = req.params;
    const { password } = req.body;
    if(!postId|| !commentId || !password) {
      return res.status(400).json({message : '데이터 형식이 올바르지 않습니다.'})
    }
  
    const comment = await prisma.comments.findFirst({ where: { postId: +postId, commentId :+commentId } });
  
    if (!comment)
      return res.status(404).json({ message: '삭제할 댓글 조회에 실패하였습니다.' });
    else if (comment.password !== password)
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  
    await prisma.comments.delete({ where: { postId: +postId, commentId : +commentId, password } });
  
    return res.status(200).json({ data: '게시글을 삭제하였습니다.' });
}catch(err){
    console.log(err);
    next(err);
}
});




  export default router;



  


