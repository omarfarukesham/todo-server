const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware here 
app.use(cors())
app.use(express.json())


//initial api
app.get('/', (req, res) => {
    res.send('Node js is ready to work')
})

//db connection code here 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sow4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect(); 
        const userCollection = client.db('userInfo').collection('todo')


     
        //get user data from mongodb and show it browser
        app.get('/task', async(req, res)=>{
            const query = {}
            const cursor = userCollection.find(query)
            const task = await cursor.toArray()
            res.send(task)
        })

        //get data from client side and send it to mongodb
        app.post('/todo', async(req, res)=>{
            const newTask = req.body;
            const result = await userCollection.insertOne(newTask)
            res.send(result)
        })

        //delete from database and client side 
        app.delete('/task/:id', async(req, res)=>{
            var id = req.params.id;
            const query = {_id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally { }
}

run().catch(console.dir)



app.listen(port, () => {
    console.log('Todo operation is running on the PORT::', port)
})