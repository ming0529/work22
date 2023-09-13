// src/services/posts.service.js

import { LikesRepository } from '../repositories/likes.js';
import { PostsService } from './posts.js';

export class LikesService {
  likesRepository = new LikesRepository();

  createLike = async (postId, userId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const post = await PostsService.postsRepository.findPostById(postId);

    if (!post) {
        throw new CustomError(404,'게시글이 존재하지 않습니다.')
    }

    const isLike = await this.likesRepository.findLike(postId, userId);

    if(!isLike){
        await this.likesRepository.createLike(postId, userId);
        return true; //좋아요했니?
    }else{
        const likeId = isLike.likeId;
        await this.likesRepository.deleteLike(likeId);
        return false; 
    }

  };

  getLikePosts = async (userId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const posts = await this.likesRepository.getLikePosts(userId);

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
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

    posts.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      
    posts.sort((a,b)=>{
        return b.likes - a.likes;
    })

    return posts;
  };


}