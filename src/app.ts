import express from "express"
import cors from "cors"
const app = express()

app.get('/', (req, res) => {
  res.send('Server working perfectly🙂')
})



export default app;