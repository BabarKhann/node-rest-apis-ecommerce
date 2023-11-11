import Joi from 'joi';

import CustomErrorHandler from '../../services/CustomErrorHandler';
import { User } from '../../models';

const registerController = {
  //validation
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
      repeat_password: Joi.ref('password'),
    });

    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
      // throw error will not catch async errors, so we will create middleware for it.
      // throw error;
    }

    // check if user is in the database already
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist('This email is already taken.')
        );
      }
    } catch (err) {
      return next(err);
    }
  },
};

export default registerController;
