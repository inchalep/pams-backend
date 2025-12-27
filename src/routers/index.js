const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes')
const petRoutes = require('./petRoutes')
const adoptRoute = require('./adoptRoutes')
router.use('/user', userRoutes);
router.use('/pets', petRoutes);
router.use('/adopt', adoptRoute);
module.exports = router