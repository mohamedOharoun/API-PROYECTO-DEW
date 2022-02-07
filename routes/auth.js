const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth.js');
//Se enviará al controlador según el verbo HTTP empleado
router.post('/register', register);
router.post('/login', login);

module.exports = router;