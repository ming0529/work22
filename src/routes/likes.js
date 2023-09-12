
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { prisma } from '../utils/prisma/index.js';
import { CustomError } from '../err.js';

const router = express.Router();

//게시글 좋아요 
router.put('/:postId/like',authMiddleware, async (req, res)=>{
    try {
        const { postId } = req.params;
        const { userId } = req.user;
    
        const isExistPost = await prisma.posts.findUnique({
          where: { postId: +postId },
        });
        
        if (!isExistPost) {
            throw new CustomError(404,'게시글이 존재하지 않습니다.')
        }
    
        let isLike = await prisma.likes.findFirst({
          where: {
            PostId: +postId,
            UserId: +userId,
          },
        });
    
        if (!isLike) {
          await prisma.likes.create({
            data: {
              PostId: +postId,
              UserId: +userId,
            },
          });
    
          return res
            .status(200)
            .json({ message: '게시글의 좋아요를 등록하였습니다.' });
        } else {
          await prisma.likes.delete({
            where: { likeId: +isLike.likeId },
          });
    
          return res
            .status(200)
            .json({ message: '게시글의 좋아요를 취소하였습니다.' });
        }
      } catch (error) {
        console.log(error);
        if(err instanceof CustomError){
            next(err);
          }else {next(new CustomError(400,"게시글 좋아요에 실패하였습니다."))}
      }


})

//특정 user가 좋아요한 게시글 목록 조회 
router.get('/like',authMiddleware, async (req, res)=>{
    try {
        const { userId } = req.user;
    
        let posts = await prisma.posts.findMany({
          where: {
            Likes: {
              some: {
                UserId: +userId,
              },
            },
          },
          select: {
            postId: true,
            UserId: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            User: {
              select: {
                nickname: true,
              },
            },
            _count: {
              select: {
                Likes: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        posts = posts.map((x)=>{
            let nickname = x.User.nickname;
            let likes = x._count.Likes;
            return {
            postId: x.postId,
            userId: x.UserId,
            title: x.title,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
            nickname,
            likes  }
        })
 
        return res.status(200).json({
          data: posts,
        });
      } catch (error) {
        console.log(error)
        next(new CustomError(400,'좋아요 게시글 조회에 실패하였습니다.'))
      }


})

export default router;