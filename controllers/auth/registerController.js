import Joi from 'joi';

const registerController = {
  //validation
  register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      repeat_password: Joi.ref('password'),
    });

    const { error } = registerSchema.validate(req.body);

    console.log(req.body);

    if (error) {
      return next(error);
      // throw error will not catch async errors, so we will create middleware for it.
      // throw error;
    }

    // res.json({ data: "asdsad" });
  },
};

export default registerController;
