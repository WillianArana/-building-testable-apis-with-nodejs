import { Router } from 'express';

import { UsersController } from '../controllers/users';

const router = Router();
const usersController = new UsersController();

router.get('/', (req, res) => usersController.get(req, res));
router.get('/:id', (req, res) => usersController.getById(req, res));

router.post('/', (req, res) => usersController.create(req, res));
router.put('/:id', (req, res) => usersController.update(req, res));
router.delete('/:id', (req, res) => usersController.remove(req, res));
router.post('/authenticate', (req, res) => usersController.authenticate(req, res));

export default router;
