const authMiddleware = ({ authentication }) => {
  return async (ctx, next) => {
    const { authorization } = ctx.headers;
    const token = authorization?.replace("Bearer ", "");
    const user = authentication.verify(token);

    if(!user?.id) throw new Error('Invalid token');

    ctx.state.user = user;

    await next();
  };
};

module.exports = authMiddleware;
