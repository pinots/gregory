import express from 'express';
import cors from 'cors'
import middleware from './middleware/index'
const app = express();
const port = 9000;

app.use(cors())

app.use(middleware.decodeToken)

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

app.listen(port, () => {
  console.log(`Api is running on ${port}.`);
});



