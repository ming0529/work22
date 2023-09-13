// src/repositories/posts.repository.js

import { prisma } from '../utils/prisma/index.js';

export class CommentsRepository {
    findAllComments = async (postId) => {
    // ORM인 Prisma에서 Posts 모델의 findMany 메서드를 사용해 데이터를 요청합니다.
    const comments = await prisma.comments.findMany({
        where: {
          PostId: +postId,
        },
        select: {
          commentId :true,
          UserId : true,
          comment: true,
          createdAt: true,
          updatedAt: true,
          User : {
            select: {
              nickname: true, // 작성자의 닉네임 필드만 선택합니다.
            },
          },
        },
      });
    
    return comments;
  };


  createComment = async (postId, userId, comment) => {
    // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
    const CreatedComment = await prisma.comments.create({
        data: {
          UserId: +userId, // 댓글 작성자 ID
          PostId: +postId, // 댓글 작성 게시글 ID
          comment: comment,
        },
      });

    return CreatedComment;
  };

  findComment = async(postId, commentId)=>{
    const targetComment = await prisma.comments.findUnique({
        where: { PostId: +postId, commentId : +commentId},
      });
      return targetComment;

  }

  updateComment = async (postId, userId,commentId,comment) => {
    // ORM인 Prisma에서 Posts 모델의 update 메서드를 사용해 데이터를 수정합니다.
    const updatedPost = await prisma.comments.update({
        data: { comment },
        where: {
          PostId: +postId,
        commentId : +commentId,
        },
      });

    return updatedPost;
  };

  deletePost = async (postId) => {
    // ORM인 Prisma에서 Posts 모델의 delete 메서드를 사용해 데이터를 삭제합니다.
    const deletedPost =await prisma.posts.delete({ where: { postId: +postId } });

    return deletedPost;
  };
}