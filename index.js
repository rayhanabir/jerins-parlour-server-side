const express = require('express')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config()
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acq7h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        
        const database = client.db("beautiParlour");
        const serviceCollection = database.collection("services");
        const ordersCollection = database.collection('orders')

        // services get from db
        app.get('/services', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray()
            res.json(result)
        })

        //get data from db using id
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.findOne(query)
            res.send(result);
        })

        

        //get all orders from db
        app.get('/orders', async(req, res)=>{
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray()
            res.json(result)
        })

        // booking list from fb filter by email
        app.get('/booking', async(req, res)=>{
          const email = req.query.email;
          const query = {email:email}
          
          const cursor = ordersCollection.find(query);
          const result = await cursor.toArray()
          res.json(result)
        })


        // order post to db
        app.post('/orders', async(req, res)=>{
          const order = req.body;
          const result = await ordersCollection.insertOne(order)
          res.json(result)
        })

        //service post to db
        app.post('/services', async(req, res)=>{
          const service = req.body;
          console.log(service)
          const result = await serviceCollection.insertOne(service)
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