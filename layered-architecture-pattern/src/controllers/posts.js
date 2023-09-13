// src/controllers/posts.controller.js

import { PostsService } from '../services/posts.js';

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class PostsController {
  postsService = new PostsService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  getPosts = async (req, res, next) => {
    try {
      // 서비스 계층에 구현된 findAllPosts 로직을 실행합니다.
      const posts = await this.postsService.findAllPosts();

      return res.status(200).json({ posts: posts });
    } catch (err) {
      next(new CustomError(400,'게시글 목록조회에 실패하였습니다.'));
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const { postId } = req.params;

      // 서비스 계층에 구현된 findPostById 로직을 실행합니다.
      const post = await this.postsService.findPostById(postId);

      return res.status(200).json({ post: post });
    } catch (err) {
      console.log(err);
      next(new CustomError(400,'게시글 상세조회에 실패하였습니다.'));
    }
  };

  createPost = async (req, res, next) => {
    try {
      const { title, content } = req.validatedData;
      const { userId } = req.user;

      // 서비스 계층에 구현된 createPost 로직을 실행합니다.
      const createdPost = await this.postsService.createPost(
        userId,
        title,
        content,
      );

      return res.status(201).json({ message: '게시글 작성에 성공하였습니다.' });
    } catch (err) {
      next(new CustomError(400,"게시글 작성에 실패하였습니다."));
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;
      const { title, content } =req.validatedData;

      // 서비스 계층에 구현된 updatePost 로직을 실행합니다.
      const updatedPost = await this.postsService.updatePost(
        postId,
        userId,
        title,
        content,
      );

      return res.status(200).json({ message: '게시글을 수정하였습니다.' });
    } catch (err) {
      console.log(err);
     if(err instanceof CustomError){
     next(err);
    }else {next(new CustomError(400,"게시글 수정에 실패하였습니다."))}
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.user;

      // 서비스 계층에 구현된 deletePost 로직을 실행합니다.
      const deletedPost = await this.postsService.deletePost(postId, userId);

      return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
    } catch (err) {
      console.log(err);
      if(err instanceof CustomError){
        next(err);
      }else {next(new CustomError(400,"게시글 삭제에 실패하였습니다."))}
    }
  };
}