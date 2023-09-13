import { CustomError } from "../err.js";

const errorController = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({ errorMessage: err.message });
  }
  return res.status(500).json({ message: "서버 에러가 발생하였습니다" });
};

export default errorController;

