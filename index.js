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

        // send a product to Mongodb 
        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            if (result) {
                console.log(`A document was inserted with the _id: ${result.insertedId}`);
                res.send(result);
            }
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
            const query = { email: email }
            const result = await userCollection.findOne(query);
            if (result) {
                console.log(`A user was readed  ${result}`);
                res.send(result);
            }
        });

        // read all sellers from database 
        app.get('/allSellers', async (req, res) => {
            const query = {userRole: "seller"};
            const result = await userCollection.find(query).toArray();
            res.send(result);
        });

        // read all buyers from database 
        app.get('/allBuyer', async (req, res) => {
            const query = {userRole: "buyer"};
            const result = await userCollection.find(query).toArray();
            res.send(result);
        });

        // delete a user from database 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(id, query);
            const result = await userCollection.deleteOne(query);
            if (result.deletedCount > 0) {
                res.send(result);
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
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