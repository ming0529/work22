// src/services/posts.service.js

import { PostsRepository } from '../repositories/posts.js';

export class PostsService {
  postsRepository = new PostsRepository();

  findAllPosts = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const posts = await this.postsRepository.findAllPosts();

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    posts = posts.map((post)=>{
      return {
        postId: post.postId,
        UserId: post.UserId,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        nickname : post.User.nickname,
      }
    })

    return posts;
  };

  findPostById = async (postId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(postId);

    return  {
      postId: post.postId,
      UserId: post.UserId,
      title: post.title,
      content : post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      nickname : post.User.nickname,
    };
  };

  createPost = async (userId, title, content) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const createdPost = await this.postsRepository.createPost(
      userId,
      title,
      content,
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: createdPost.postId,
      title: createdPost.title,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };

  updatePost = async (postId, userId, title, content) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(postId);
    if (!post)  throw new CustomError(404,"수정할 게시글 조회에 실패하였습니다.")

    if(post.UserId !==userId ) {
      throw new CustomError(403,"게시글의 수정권한이 존재하지 않습니다.")
     }

    // 저장소(Repository)에게 데이터 수정을 요청합니다.
    const result = await this.postsRepository.updatePost(postId, title, content);
    if(!result){
      throw new CustomError(401,"게시글이 정상적으로 수정되지 않았습니다.")
    }

    // 변경된 데이터를 조회합니다.
    const updatedPost = await this.postsRepository.findPostById(postId);

    return {
      postId: updatedPost.postId,
      title: updatedPost.title,
      content: updatedPost.content,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  };

  deletePost = async (postId, userId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new CustomError(404,"게시글이 존재하지 않습니다.")

    if(post.UserId !==userId) {
      throw new CustomError(403,"게시글의 삭제 권한이 존재하지 않습니다.")
    }

    // 저장소(Repository)에게 데이터 삭제를 요청합니다.
    const result = await this.postsRepository.deletePost(postId);
    if(!result){
      throw new CustomError(401,"게시글이 정상적으로 삭제되지 않았습니다.")
    } 

    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  };
}