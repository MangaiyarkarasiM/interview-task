var express = require('express');
var router = express.Router();
let controller = require('../controllers/users');

/* GET users listing. */
router.get('/', controller.getUserDetails);

/* Creating the new user */
router.post('/register', controller.registerUser);

/* Validating the user credentials */
router.post('/login', controller.login);

/* Updating the user details with _id*/
router.put('/:id', controller.updateUserWithId);

/* Deleting the user with _id */
router.delete('/:id', controller.deleteUserWithId);

module.exports = router;
