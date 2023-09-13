// src/services/posts.service.js

import {  CommentsRepository } from '../repositories/comments.js';
import { PostsService } from '../services/posts.js';

export class CommentsService {
  commentsRepository = new CommentsRepository();

  findAllComments = async (postId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.

    const post = await PostsService.postsRepository.findPostById(postId);
    if (!post)  throw new CustomError(404,"게시글이 존재하지 않습니다.")

    const comments = await this.commentsRepository.findAllComments(postId);

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    comments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    comments = comments.map((comment)=>{
        return {
          commentId : comment.commentId,
          userId: comment.UserId,
          nickname : comment.User.nickname,
          comment: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        }
      })

    return comments;
  };

  createComment = async (postId, userId, comment) => {

    const post = await  PostsService.postsRepository.findPostById(postId);
    if (!post)  throw new CustomError(404,"작성할 게시글이 존재하지 않습니다.")

    // 저장소(Repository)에게 데이터를 요청합니다.
    const createdComment = await this.commentsRepository.createComment(
        postId,
        userId,
        comment,
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: createdComment.postId,
      commentId: createdComment.commentId,
      comment: createdComment.comment,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
    };
  };

  updateComment = async (postId, userId, commentId, comment) => {
    
    const post = await PostsService.postsRepository.findPostById(postId);
    if (!post)  throw new CustomError(404,"게시글이 존재하지 않습니다.")


    const targetComment = await this.commentsRepository.findComment(postId, commentId);
    if (!targetComment){
        throw new CustomError(404,'댓글이 존재하지 않습니다.')
      }
    if(targetComment.UserId!==userId){
        throw new CustomError(400,'댓글의 수정권한이 존재하지 않습니다.');
      }

    // 저장소(Repository)에게 데이터 수정을 요청합니다.
    const result = await this.commentsRepository.updateComment(postId, commentId, comment);
    if(!result){
        throw new CustomError(400, '댓글 수정이 정상적으로 처리되지 않았습니다.')
      }

    // 변경된 데이터를 조회합니다.
    const updatedComment = await this.commentsRepository.findComment(postId, commentId);

    return {
      postId: updatedComment.PostId,
      comment: updatedComment.comment,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    };
  };

  deleteComment = async (postId, userId) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const post = await  PostsService.postsRepository.findPostById(postId);
    if (!post) throw new CustomError(404,"게시글이 존재하지 않습니다.")

    const targetComment = await this.commentsRepository.findComment(postId, commentId);
    if (!targetComment){
        throw new CustomError(404,'댓글이 존재하지 않습니다.')
      }
    if(targetComment.UserId!==userId){
        throw new CustomError(400,'댓글의 수정권한이 존재하지 않습니다.');
      }

    // 저장소(Repository)에게 데이터 삭제를 요청합니다.
    const result = await this.commentsRepository.deleteComment(postId, commentId);
    if(!result){
        throw new CustomError(400,'댓글 삭제가 정상적으로 처리되지 않았습니다.')
      } 

    return {
      postId: result.PostId,
      comment: result.comment,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  };
}