export default (req, res, next) => {
    return res.status(404).json({ message: "Page Not Found" });
  };