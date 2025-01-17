// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require("sequelize");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection (replace placeholders with your details)
const sequelize = new Sequelize(
  "your_database_name",
  "your_username",
  "your_password",
  {
    host: "localhost",
    dialect: "postgres",
  }
);

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Unable to connect to database:", err));

// Define models
const Shoe = sequelize.define("Shoe", {
  shoeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync models with the database
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Error syncing database:", err));

// Routes

// Get all shoes
app.get("/shoes", async (req, res) => {
  try {
    const shoes = await Shoe.findAll();
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shoes" });
  }
});

// Add a new shoe
app.post("/shoes", async (req, res) => {
  const { shoeName, price, stock, image } = req.body;
  try {
    const newShoe = await Shoe.create({ shoeName, price, stock, image });
    res.status(201).json(newShoe);
  } catch (error) {
    res.status(500).json({ error: "Failed to create shoe" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
