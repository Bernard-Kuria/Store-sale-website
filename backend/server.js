// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const compression = require("compression");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(compression());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Database connection
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Only needed for some providers
    },
  },
});

module.exports = sequelize;

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Unable to connect to database:", err));

// Define models
const Store = sequelize.define("Store", {
  productName: {
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

const ContactInfo = sequelize.define("ContactInfo", {
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Admin = sequelize.define("Admin", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync models with the database
sequelize
  .sync({ alter: true }) // Ensure schema is up to date
  .then(async () => {
    console.log("Database synced");

    // Check if the admin exists
    const admin = await Admin.findOne({ where: { username: "admin" } });

    // Create admin if not found
    if (!admin) {
      await Admin.create({ username: "admin", password: "kicks2025" });
      console.log("Admin created with default password.");
    }
  })
  .catch((err) => console.error("Error syncing database:", err));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes

// Fetch Admin Password
app.get("/admin/password", async (req, res) => {
  try {
    const admin = await Admin.findOne({ where: { username: "admin" } });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ password: admin.password });
  } catch (error) {
    console.error("Error fetching admin password:", error);
    res.status(500).json({ error: "Failed to fetch password" });
  }
});

// Get all shoes
app.get("/store", async (req, res) => {
  try {
    const items = await Store.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from store" });
  }
});

// Add a new shoe
app.post("/store", upload.single("image"), async (req, res) => {
  const { productName, price, stock } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newStore = await Store.create({
      productName,
      price,
      stock,
      image: image ? `/uploads/${image}` : null,
    });
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: "Failed to create store item" });
  }
});

// Delete a shoe by productName
const fs = require("fs");

app.delete("/store/:productName", async (req, res) => {
  const { productName } = req.params;

  try {
    // Fetch the item to get the image path
    const item = await Store.findOne({ where: { productName } });

    if (!item) {
      return res.status(404).send("Shoe not found.");
    }

    // Delete the item from the database
    await Store.destroy({ where: { productName } });

    // Check if the item has an image and delete the image file
    if (item.image) {
      const imagePath = path.join(__dirname, item.image); // Get the full path to the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
          return res.status(500).send("Failed to delete image file.");
        }
        console.log("Image file deleted successfully.");
      });
    }

    res.status(200).send({ message: "Shoe deleted successfully." });
  } catch (error) {
    res.status(500).send("An error occurred while removing the shoe.");
  }
});

// Get contact details
app.get("/contact", async (req, res) => {
  try {
    const contact = await ContactInfo.findOne();
    if (!contact) {
      return res.status(404).json({ message: "Contact details not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact details:", error);
    res.status(500).json({ error: "Failed to fetch contact details" });
  }
});

// Update contact details
app.put("/contact", async (req, res) => {
  const { phone, email } = req.body;
  try {
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = await ContactInfo.create({ phone, email });
    } else {
      await contact.update({ phone, email });
    }
    res.status(200).json({ message: "Contact details updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update contact details." });
  }
});

// Update admin password
app.put("/admin/password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findOne({ where: { username: "admin" } });
    if (!admin) return res.status(404).json({ error: "Admin not found." });
    if (admin.password !== currentPassword) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }
    await admin.update({ password: newPassword });
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password." });
  }
});

// Serve static files from "uploads" directory
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
