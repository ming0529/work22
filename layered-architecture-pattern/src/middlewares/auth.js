
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import { CustomError } from '../err.js';

export default async function (req, res, next) {
  try {
    const { authorization } = req.cookies;
    if (!authorization){
      throw new CustomError(403, '로그인이 필요한 기능입니다.')
    } 

    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer')
      throw new Error('토큰 타입이 일치하지 않습니다.');

    const decodedToken = jwt.verify(token, 'customized_secret_key');//앞서 받아온 암호적인 토큰을 복호화 진행
  
    const userId = decodedToken.userId;

    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      res.clearCookie('authorization');//그런아이디 존재하지 않으니까.. 쿠키이제 삭제 그걸로 로그인 시도 못하게
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    // req.user에 사용자 정보를 저장합니다.저 user 에는 users테이블에 있는 userid 가 복호화 한 userid인 값을 찾아서 데이터 알랴줌 객체형태 가 user에 저장됨 
    req.user = user;

    next();
  } catch (error) {
    console.log(err);
    res.clearCookie('authorization');

    //토큰이 만료되었거나, 조작되었을 때, 에러 메시지를 다르게 출력합니다.
    switch (error.name) {
      case 'TokenExpiredError'||'JsonWebTokenError':
        next(new CustomError(403, '전달된 쿠키에서 오류가 발행사였습니다.'))
      default:
        next(new CustomError(400, '게시글 작성에 실패하였습니다.'))
    }
  }
}