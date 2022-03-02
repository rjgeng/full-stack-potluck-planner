const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const { JWT_SECRET } = require("../config"); // use this secret!
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const jwt = require('jsonwebtoken')
const { BCRYPT_ROUNDS } = require('../config')

router.post("/register", validateRoleName, (req, res, next) => {
  /**
    [POST] /api/auth/register { "username": "anna", "password": "1234", "role_name": "angel" }

    response:
    status 201
    {
      "user"_id: 3,
      "username": "anna",
      "role_name": "angel"
    }
   */
  const { username, password } =req.body
  const { role_name } = req
  const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
  User.add({username, password: hash, role_name})
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});


router.post("/login", checkUsernameExists, (req, res, next) => {
  /**
    [POST] /api/auth/login { "username": "admin", "password": "password" }
    response: status 200    
    {
      "message": "admin is back!",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ETC.ETC"
    }

    The token must expire in one day, and must provide the following information in its payload:
    {
      "subject"  : 1       // the user_id of the authenticated user
      "username" : "admin"   // the username of the authenticated user
      "role_name": "admin" // the role of the authenticated user
    }
   */
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = builderToken(req.user)
    res.json({
      message: `${req.user.username} is back!`,
      token
    })
  } else {
    next ({status: 401, message: 'Invalid credentials'})
  }
  });
  
  function builderToken(user) {
    const payload = {
      subject: user.user_id,
      username: user.username,
      role_name: user.role_name
    }
    const options = {
      expiresIn: '1d',
    }
    const token = jwt.sign(payload, JWT_SECRET, options)
  
    return token
  }
  
  
  module.exports = router;