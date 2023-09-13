// src/controllers/posts.controller.js

import { UserService } from '../services/user.js';

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class UserController {
  userService = new UserService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  createUser = async (req, res, next) => {
    try {
        const { nickname, password } =req.validatedData;

      const createdUser = await this.userService.createUser(
        nickname, password
      );

      return res.status(201).json({ message: '회원가입에 성공하였습니다.' });
    } catch (err) {
        next(new CustomError(400, '회원가입에 실패하였습니다.'));
    }
  };

  authenticateUser = async (req, res, next) => {
    try {
        const { nickname, password } = req.body;
      // 서비스 계층에 구현된 updatePost 로직을 실행합니다.
      const token = await this.userService.authenticateUser(
        nickname, password
      );
      res.cookie('authorization', `Bearer ${token}`);
      let partOfToken = token.slice(0,10);

      return res.status(200).json({ "token": `로그인성공 토큰은 ${partOfToken}......` });
    } catch (err) {
      console.log(err);
     if(err instanceof CustomError){
     next(err);
    }else {next(new CustomError(400,"게시글 수정에 실패하였습니다."))}
    }
  };


}