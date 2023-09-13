// src/repositories/posts.repository.js

import { prisma } from '../utils/prisma/index.js';

export class LikesRepository {
  getLikePosts = async (userId) => {
    // ORM인 Prisma에서 Posts 모델의 findMany 메서드를 사용해 데이터를 요청합니다.
    const posts = await prisma.posts.findMany({
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
      });

    return posts;
  };

  findLike = async (postId, userId) => {
    // ORM인 Prisma에서 Posts 모델의 findUnique 메서드를 사용해 데이터를 요청합니다.
    const isLike = await prisma.likes.findFirst({
        where: {
          PostId: +postId,
          UserId: +userId,
        },
      });
    return  isLike;
  };

  createLike = async (postId, userId) => {
    // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
    const createdLike = await prisma.likes.create({
        data: {
          PostId: +postId,
          UserId: +userId,
        },
      });

    return  createdLike;
  };

  deleteLike = async (likeId) => {
    // ORM인 Prisma에서 Posts 모델의 delete 메서드를 사용해 데이터를 삭제합니다.
    const deletedLike = await prisma.likes.delete({
        where: { likeId: +likeId },
      });

    return deletedLike;
  };


}