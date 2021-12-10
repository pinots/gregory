const express = require('express')
const app = express()
const router = express.Router()

router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.get('/', (req, res) => res.send('Hello World!'));