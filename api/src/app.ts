import express from 'express';
import { Request, Response} from 'express'
import cors from 'cors'
import { connect } from './database/database';
require('dotenv/config')
const app = express();
const port = 9000;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
app.use(cors())
app.use(express.json())

connect()

let userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    hashPassword: {type: String, required:true},
},{ collection: 'users'}
)

let User = mongoose.model('User', userSchema)

app.post('/login', async (req: Request, res:Response) => {
  const { email, password } = req.body
  // Find the user in my collection
  const user = await User.findOne({ email })
  console.log(user)
  if(!user) {
    return res.json({ status: 'error', error: 'Invalid username or password'})
  } 
  console.log(user.email)
  if(await bcrypt.compare(password, user.hashPassword)){
    // the username, password combination is succesful
    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, process.env.JWT_SECRET)
    return res.json({ status: 'ok', data: token})
  }
  res.json({status: 'ok', error:'Invalid username or password'})
})

app.post('/register', async (req: Request, res:Response) =>{
  const {email, password} = req.body

  if(!email || typeof email !== 'string'){
    return res.json({status:'error', error:'Invalid Username'})
  }
  if(!password || typeof password !== 'string'){
    return res.json({status:'error', error:'Invalid password'})
  }
  if(password.length < 6){
    return res.json({status:'error', error:'Password should be atleat 6 characters'})
  }
  //Hashing the password
  const hashPassword = await bcrypt.hash(password, 10)
  try {
    const response = await User.create({
      email,
      hashPassword,
    })
    console.log('user created', response)
  } catch(error){
    if(error.code === 11000){
      //duplicate key
      return res.json({ status:'error', error:'Email already in use'})
    }
    throw error
  }

  res.json({ status: 'ok' })
})

// app.get('/api/display', ( req: express.Request, res: express.Response) => {
//   res.json({ user:[
//     {
//       id: 0,
//       username: 'User 1'
//     },
//     {
//       id: 2,
//       username: 'User 2'
//     },
//     {
//       id: 3,
//       username: 'User 3'
//     },
//   ]
//   });
// })

app.listen(port, () => {
  console.log(`Api is running on ${port}.`);
});



