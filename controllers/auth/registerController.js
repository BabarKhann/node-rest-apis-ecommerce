import Joi from 'joi';
import bcrypt from 'bcrypt';

import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';

import { RefreshToken, User } from '../../models';

import { REFRESH_SECRET } from '../../config';

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
    } catch (error) {
      return next(error);
    }

    const { name, email, password } = req.body;

    // Hash password
    const hashedPass = await bcrypt.hash(password, 10);

    // prepare the model
    const user = new User({
      name,
      email,
      password: hashedPass,
    });

    let access_token;
    let refresh_token;

    try {
      const result = await user.save();
      console.log(result);

      //Token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        '1y',
        REFRESH_SECRET
      );
      // database whitelist
      await RefreshToken.create({ token: refresh_token });
      //
    } catch (error) {
      return next(error);
    }

    return res.json({ access_token, refresh_token });
  },
};

export default registerController;
