//1-15
import { LikeService } from '../services/like.js';

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class LikeController {
  likeService = new LikeService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  createLike = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user;

      // 좋아요를 했는지 취소했는지 
      const isCreateLike = await this.likeService.createLike(
        postId,
        userId,
      );
      if(isCreateLike){
        return res
        .status(200)
        .json({ message: '게시글의 좋아요를 등록하였습니다.' });
      }else{
        return res
            .status(200)
            .json({ message: '게시글의 좋아요를 취소하였습니다.' });
      }

    } catch (err) {
        console.log(err);
        if(err instanceof CustomError){
            next(err);
          }else {next(new CustomError(400,"게시글 좋아요에 실패하였습니다."))}
      }
    }

  getLikePosts = async (req, res, next) => {
    try {
        const { userId } = req.user;

      const likePosts = await this.likeService.getLikePosts(userId);

      return res.status(200).json({ posts: likePosts });
    } catch (err) {
        console.log(error)
        next(new CustomError(400,'좋아요 게시글 조회에 실패하였습니다.'))
    }
  };
}
