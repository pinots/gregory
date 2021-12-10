import express from 'express';
import cors from 'cors'
import { Request, Response} from 'express'
import { connect } from './database/database';
import { Configuration, PlaidApi, PlaidEnvironments, LinkTokenCreateRequest, Products, CountryCode } from 'Plaid'
import { link } from 'fs';

const plaid = require('plaid')
require('dotenv/config')
const app = express();
const port = 9000;
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

app.use(bodyParser.urlencoded({extends: true}))
app.use(cors())
app.use(express.json())

connect()

let userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    hashPassword: {type: String, required:true},
    transaction: Array,
},{ collection: 'users'}
)

let User = mongoose.model('User', userSchema)
app.post('/login', async (req: Request, res:Response) => {
  const { email, password } = req.body
  // Find the user in my collection
  const user = await User.findOne({ email })
  console.log(user)
  if(!user) {
    return res.json({ status: 'error', error: '401'})
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
  res.json({status: 'error', error:'401'})
})

app.post('/register', async (req: Request, res:Response) =>{
  const {email, password} = req.body

  if(!email || typeof email !== 'string'){
    return res.json({status:'error', error:'Invalid Username'})
  }
  if(!password || typeof password !== 'string'){
    return res.json({status:'error', error:'Invalid Password'})
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

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.CLIENT_ID,
      'PLAID-SECRET': process.env.SECRET,
    }
  }
})

const client = new PlaidApi(configuration)
// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;

app.get('/create_link_token', async function (request, response) {
    // Get the client_user_id by searching for the current user
    const linkTokenParams: LinkTokenCreateRequest = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: 'test',
        },
        client_name: 'Plaid Test App',
        products: [Products.Auth, Products.Transactions],
        language: 'fr',
        webhook: 'https://webhook.example.com',
        country_codes: [CountryCode.Us],
      };
      try {
        const createResponse = await client.linkTokenCreate(linkTokenParams)
        const { link_token } = createResponse.data
        response.json({link_token})
      } catch(error){
        console.log(error)
      }
  });
import { TransactionsGetRequest } from 'plaid'
const moment = require('moment');
app.post('/plaid_token_exchange', async (req: Request, res: Response) => {
  const { public_token } = req.body
  try{
    const response = await client.itemPublicTokenExchange({ public_token})
    const access_token = response.data.access_token

    const accounts_response = await client.accountsGet({access_token})
    console.log('-------- ACCOUNT RESPONSE ----------')
    console.log(accounts_response.data)
    
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');
    const configs = {
      access_token: access_token,
      start_date: startDate,
      end_date: endDate,
      options: {
        count: 250,
        offset: 0,
      },
    };
    const identityResponse = await client.transactionsGet(configs)
    console.log('--------- Identity Response --------')
    console.log(identityResponse.data)
    
    const transactioneResponse = await client.accountsBalanceGet({access_token})
    console.log('--------- Accounts Balance Response --------')
    console.log(transactioneResponse.data)

  } catch(error){
    console.log(error)
  }
  
  // ACCESS_TOKEN = tokenResponse.data.access_token
  // const accResponse = await client.accountsGet({ access_token : ACCESS_TOKEN})
  // console.log(accResponse)
})

app.listen(port, () => {
  console.log(`Api is running on ${port}.`);
});



