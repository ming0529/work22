// src/controllers/posts.controller.js

import { CommentsService } from '../services/posts.js';

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class CommentsController {
    commentsService = new  CommentsService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  getComments = async (req, res, next) => {
    try {
      const postId=req.postId;
      // 서비스 계층에 구현된 findAllPosts 로직을 실행합니다.
      const comments = await this.commentsService.findAllComments(postId);

      return res.status(200).json({ comments: comments });
    } catch (err) {
        console.log(err);
        if(err instanceof CustomError){
          next(err);
        }else {next(new CustomError(400,"댓글 조회에 실패하였습니다."))}
    }
  };


  createComment = async (req, res, next) => {
    try {
        const { comment } = req.validatedData;
        const postId = req.postId;
        const { userId } = req.user;

      // 서비스 계층에 구현된 createPost 로직을 실행합니다.
      const createdComment = await this.commentsService.createComment(
        postId,
        userId,
        comment,
      );

      return res.status(201).json({ message: "댓글을 작성하였습니다." });
    } catch (err) {
        if(err instanceof CustomError){
            next(err);
          }else {next(new CustomError(400,"댓글 작성에 실패하였습니다."))}
    }
  };

  updateComment = async (req, res, next) => {
    try {
        const { comment } =req.validatedData;
        const postId = req.postId;
        const { commentId } = req.params;
        const {userId} = req.user;

      // 서비스 계층에 구현된 updatePost 로직을 실행합니다.
      const updatedComment = await this.commentsService.updateComment(
        postId,
        userId,
        commentId,
        comment
      );

      return res.status(200).json({ message: '댓글을 수정하였습니다.' });
    } catch (err) {
      console.log(err);
      if(err instanceof CustomError){
        next(err);
      }else {next(new CustomError(400,"댓글 수정에 실패하였습니다."))}
    }
  };

  deleteComment = async (req, res, next) => {
    try {
        const postId = req.postId;
        const {userId} = req.user;
        const { commentId } = req.params;

      // 서비스 계층에 구현된 deletePost 로직을 실행합니다.
      const deletedComment = await this.commentsService.deleteComment(postId, userId,commentId);

      return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
    } catch (err) {
      console.log(err);
      if(err instanceof CustomError){
        next(err);
      }else {next(new CustomError(400,"댓글 삭제에 실패하였습니다."))}
    }
  };
}