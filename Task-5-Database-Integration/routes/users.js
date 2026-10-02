import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { validateUser, validateId } from '../middleware/validateUser.js';

const router = Router();

router.get('/', getUsers);
router.post('/', validateUser(), createUser);

router.get('/:id', validateId, getUser);
router.put('/:id', validateId, validateUser(), updateUser);
router.patch('/:id', validateId, validateUser({ partial: true }), updateUser);
router.delete('/:id', validateId, deleteUser);

export default router;
