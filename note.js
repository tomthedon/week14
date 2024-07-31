const mongoose = require("mongoose");
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// User Schema Definition
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    hashedPassword: {
        type: String,
        required: true
    },
});

const User = mongoose.model("User", userSchema);

// Get user
app.get("/users/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let foundUser = await User.findById(id);
        if (!foundUser) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(foundUser);
    } catch (error) {
        console.log("Error: " + error);
        res.status(400).send(error);
    }
});

// Create a user
app.post("/users", async (req, res) => {
    try {
        const { username, password } = req.body;
        let hashedPassword = password + "HASHED";
        const newUser = new User({ username, hashedPassword });
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        console.log("Error: " + error);
        res.status(400).send(error);
    }
});

// Backpack Schema Definition
const backpackSchema = new mongoose.Schema({
    notebook: {
        type: [String],
        required: true,
    },
    pen: {
        type: String,
        required: true,
    },
    laptop: {
        type: [String],
        required: true,
    },
    penscils: {
      type: [String],
      required: true,
  },
  textbook: {
    type: [String],
    required: true,
},
});

const Backpack = mongoose.model("Backpack", backpackSchema);

// MongoDB Connection URI and Options
const uri = "mongodb+srv://thomas1:thomas1234@thomas0.nxspdjv.mongodb.net/?retryWrites=true&w=majority&appName=thomas0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Connect to MongoDB
async function connectDb() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("Error: " + error);
    }
}

// Start Express Server
app.listen(PORT, async () => {
    await connectDb().catch(console.dir);
    console.log(`Express API at: localhost:${PORT}`);
});
