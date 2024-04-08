const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@priya.4n8qanq.mongodb.net/?retryWrites=true&w=majority&appName=priya`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const usersCollection = client.db("dribbbleDb").collection("users");
    const selectCollection = client.db("dribbbleDb").collection("designer");

    
    //  ------------------------ select Option start ----------------------------
    app.get('/select', async (req, res) => {
      const result = await selectCollection.find().toArray();
      res.send(result);
    });
    //  ------------------------ select Option end -------------------------------

    // ------------------------- User Start ---------------------------------------

    //  if username exists
    app.get('/users/username/:username', async (req, res) => {
      const username = req.params.username;
      const existingUser = await usersCollection.findOne({ username: username });
      res.json({ exists: !!existingUser });
    });
    
    app.post('/users', async (req, res) => {
        const user = req.body;
        const emailQuery = { email: user.email};
        const usernameQuery = { username: user.username };
       
        const existingEmailUser = await usersCollection.findOne(emailQuery);
        const existingUsernameUser = await usersCollection.findOne(usernameQuery);
        
        if (existingEmailUser || existingUsernameUser) {
            return res.send({ message: 'User or username already exists', insertedId: null });
        }

        const result = await usersCollection.insertOne(user);
    res.send({ message: 'User created successfully.', insertedId: result.insertedId });
      });

      // ------------------------ User end ------------------------------------------------

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Dribbble is sitting')
  })
  
  app.listen(port, () => {
    console.log(`Dribbble is sitting on port ${port}`);
  })