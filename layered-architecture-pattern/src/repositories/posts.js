// src/repositories/posts.repository.js

import { prisma } from '../utils/prisma/index.js';

export class PostsRepository {
  findAllPosts = async () => {
    // ORM인 Prisma에서 Posts 모델의 findMany 메서드를 사용해 데이터를 요청합니다.
    const posts = await prisma.posts.findMany({
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
    });

    return posts;
  };

  findPostById = async (postId) => {
    // ORM인 Prisma에서 Posts 모델의 findUnique 메서드를 사용해 데이터를 요청합니다.
    const post = await prisma.posts.findFirst({
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

    return post;
  };

  createPost = async (userId, title, content) => {
    // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
    const createdPost = await prisma.posts.create({
      data: {
        UserId: userId,
        title,
        content,
      },
    });

    return createdPost;
  };

  updatePost = async (postId, title, content) => {
    // ORM인 Prisma에서 Posts 모델의 update 메서드를 사용해 데이터를 수정합니다.
    const updatedPost = await prisma.posts.update({
      data: { title, content },
      where: {
        postId: +postId,
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