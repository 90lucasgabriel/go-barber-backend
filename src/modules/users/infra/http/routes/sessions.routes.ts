import { Router } from 'express';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';
import { celebrate, Segments, Joi } from 'celebrate';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  sessionsController.create,
);

export default sessionsRouter;
