import { Router } from 'express';
var usersRouter = Router();

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default usersRouter;
