import { Router } from 'express';
var indexRouter = Router();

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

export default indexRouter;
