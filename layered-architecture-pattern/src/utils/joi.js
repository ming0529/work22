import Joi from "joi";

const postSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  const commentSchema = Joi.object({
    comment: Joi.string().required(),
  });

  const signupSchema = Joi.object({
    nickname: Joi.string().min(3).regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/).required(),
    password:Joi.string().min(4).custom((value, helpers) => {
      const nickname = helpers.root._original.nickname;
      if (value.includes(nickname)) {
        return helpers.error('any.invalid');
      }
      return value;
    }).required(),
    confirm: Joi.string().valid(Joi.ref('password')).required(),
  });


  export default {
    postSchema,
    commentSchema,
    signupSchema,
  };


