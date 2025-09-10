module.exports = (fn) => {
  // this function will be called when new tour is created
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
