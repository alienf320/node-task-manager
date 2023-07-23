const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const auth = async (req, res, next) => {
  //console.log('token', req.headers.authorization)
  try {
    //console.log(req.headers.authorization)
    const token = req.headers.authorization.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'asdfasdf')
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    req.token = token
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({message: "Algo falló en el auth"})    
  }
}

module.exports = auth