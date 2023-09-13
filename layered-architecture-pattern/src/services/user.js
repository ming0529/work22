// src/services/posts.service.js

import { UserRepository } from '../repositories/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserService {
  userRepository = new UserRepository();

  createUser = async (nickname, password) => {

    const user = await this.userRepository.findUser(nickname);
    if (user) throw new CustomError(409,'중복된 닉네임입니다.')
   
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await this.userRepository.createUser(nickname,hashedPassword);

    return {nickname: createdUser.nickname};
  };

  authenticateUser = async (nickname, password) => {

    const user = await this.userRepository.findUser(nickname);
    if (!user || !(await bcrypt.compare(password, user.password))){
        throw new CustomError(412,"닉네임 또는 패스워드를 확인해주세요.")
      }
      const token = jwt.sign(
        {userId: user.userId,},
        process.env.SECRET_KEY,
      );

    return token;
  };
}