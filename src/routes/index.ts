import { Router } from 'express';
import productsRoute from './products';
import usersRoute from './users';

const router = Router();

router.use('/products', productsRoute);
router.use('/users', usersRoute);
router.get('/', (req, res) => {
  res.send('Building testable API with nodejs: 1.0.0');
});

export default router;
