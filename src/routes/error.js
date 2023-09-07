export default (err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ message: "서버 에러가 발생하였습니다" });
  };