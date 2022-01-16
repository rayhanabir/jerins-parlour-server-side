const express = require('express')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

async function run(){
    try{
        await client.connect();
        
        const database = client.db("beautiParlour");
        const serviceCollection = database.collection("services");


        // services get from db
        app.get('/services', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray()
            res.json(result)
        })

        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello Parlour!')
})

app.listen(port, () => {
  console.log(`start at port:${port}`)
})