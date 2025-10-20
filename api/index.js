import express from "express"
import cors from "cors"
import route from "../routes/index.js"
import "../db/index.js"
const app = express()

app.use(express.json())

app.use(cors({
  origin: ['https://project-frontend-smoky-pi.vercel.app','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
        


app.get("/",(req, res)=>{
res.status(500).send("User get Successfully")

})

app.use("/api", route); // All routes will start with /api


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
 console.log(`Server is running on ${PORT}`)
})
