import Joi from 'joi';
import { RefreshToken, User } from '../../models';
import CustomErrorHandler from '../../services/CustomErrorHandler';
import JwtService from '../../services/JwtService';
import { REFRESH_SECRET } from '../../config';

const refreshController = {
  async refresh(req, res, next) {
    //validation
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //check token in database
    let refreshToken;
    try {
      refreshToken = await RefreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
      }
      let userId;
      try {
        const { _id } = await JwtService.verify(
          refreshToken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
      }

      const user = User.findOne({ _id: userId });

      if (!user) {
        return next(CustomErrorHandler.unAuthorized('No user found'));
      }

      let access_token;
      let refresh_token;

      //token
      access_token = JwtService.sign({ _id: user._id, role: user.role });
      refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        '1y',
        REFRESH_SECRET
      );

      await RefreshToken.create({ token: refresh_token });

      return res.json({ access_token, refresh_token });

      //
    } catch (error) {
      return next(error);
    }
  },
};

export default refreshController;
