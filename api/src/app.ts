import express from 'express';
import { Request, Response} from 'express'
import cors from 'cors'
import middleware from './middleware/index'
import { connect } from './database/database';
import { User } from './database/users/user.model'
require('dotenv/config')
const app = express();
const port = 9000;

app.use(cors())
app.use(express.json())
app.use(middleware.decodeToken)

connect()

app.get('/api/display', ( req: express.Request, res: express.Response) => {
  res.json({ user:[
    {
      id: 0,
      username: 'User 1'
    },
    {
      id: 2,
      username: 'User 2'
    },
    {
      id: 3,
      username: 'User 3'
    },
  ]
  });
})
app.post('/api/signin', async (req: Request, res:Response) =>{
  const { email, password } =req.body;
  
  const user = User.build({email, password})
  await user.save()
  return res.status(201).send(user)
})

app.listen(port, () => {
  console.log(`Api is running on ${port}.`);
});



