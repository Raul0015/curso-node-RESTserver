const {Router} = require('express');

const router = Router();

const {getUsers,
       putUser,
       postUser,
       deleteUser,
       patchUser} = require('../controllers/users');

router.get('/', getUsers);

// Update informatio
router.put('/:id', putUser);

// Add a new user or other
router.post('/', postUser);

// Delete something
router.delete('/', deleteUser);

router.patch('/', patchUser)

module.exports = router;