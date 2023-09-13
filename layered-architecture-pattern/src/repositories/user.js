// src/repositories/posts.repository.js

import { prisma } from '../utils/prisma/index.js';

export class UserRepositor {


  findUser = async (nickname) => {
    // ORM인 Prisma에서 Posts 모델의 findUnique 메서드를 사용해 데이터를 요청합니다.
    const user = await prisma.users.findUser({
        where: {
          nickname,
        },
      });

    return user;
  };

  createUser = async (nickname, hashedPassword) => {
    // ORM인 Prisma에서 Posts 모델의 create 메서드를 사용해 데이터를 요청합니다.
    const createdUser =await prisma.users.createUser({
        data: {
          nickname,
          password: hashedPassword, // 암호화된 비밀번호를 저장합니다.
        },
      });

    return createdUser;
  };

}