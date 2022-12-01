const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})



// *****Node Js & Mongo Db Crud Option****** //
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hu5muuh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () => {
    try {
        const categoriesCollection = client.db("productsDb").collection("categoriesCollection");
        const productsCollection = client.db("productsDb").collection("productsCollection");
        const userCollection = client.db("usersDb").collection("usersCollection");

        // read all product category from database 
        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        // read available products from database 
        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            if (result) {
                res.send(result);
            }
        });
        // read products from database by categoryId 
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { categoryId: id };
            const result = await productsCollection.find(query).toArray();
            if (result) {
                res.send(result);
            }
        });

        // send a user to Mongodb 
        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            if (result) {
                console.log(`A document was inserted with the _id: ${result.insertedId}`);
                res.send(result);
            }
        });

        // read a user from Mongodb 
        app.get('/user', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = {email: email}
            const result = await userCollection.findOne(query);
            if (result) {
                console.log(`A user was readed  ${result}`);
                res.send(result);
            }
        });

    } catch (err) {
        console.log(err.name, err.message, err.stack)
    }
}
run();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})