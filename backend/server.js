// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const compression = require("compression");
require("dotenv").config();

console.log("Database URL:", process.env.DATABASE_URL);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});

// Database connection
const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: process.env.DATABASE_URL
    ? { ssl: { require: true, rejectUnauthorized: false } } // Enable SSL only for Railway
    : {}, // No SSL for local PostgreSQL
});

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
    allowNull: true,
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
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this matches your intended storage location
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;

// Routes

app
  .route("/admin/password")
  .get(async (req, res) => {
    try {
      const admin = await Admin.findOne({ where: { username: "admin" } });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json({ message: "Password fetched successfully" });
    } catch (error) {
      console.error("Error fetching admin password:", error);
      res.status(500).json({ error: "Failed to fetch password" });
    }
  })
  .post(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
      const admin = await Admin.findOne({ where: { username: "admin" } });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (currentPassword && newPassword) {
        // Update password logic
        if (currentPassword === admin.password) {
          admin.password = newPassword;
          await admin.save();
          return res
            .status(200)
            .json({ message: "Password updated successfully" });
        } else {
          return res
            .status(401)
            .json({ message: "Incorrect current password" });
        }
      } else if (currentPassword) {
        // Check password logic
        if (currentPassword === admin.password) {
          return res.status(200).json({ message: "Password matched" });
        } else {
          return res.status(401).json({ message: "Incorrect password" });
        }
      }
    } catch (error) {
      console.error("Error handling password:", error);
      res.status(500).json({ error: "Failed to handle password request" });
    }
  });

// Get all items from the store
app.get("/store", async (req, res) => {
  try {
    const items = await Store.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from store" });
  }
});

// Add items to the store
app.post("/store", upload.single("image"), async (req, res) => {
  console.log("Received Headers:", req.headers);
  console.log("Received Body:", req.body);
  console.log("Received File:", req.file);

  try {
    const { productName, price, stock } = req.body;
    const image = req.file ? req.file.filename : null; // ✅ Fix missing image

    // 🛑 Check for missing fields
    if (!productName || !price || !stock) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newStore = await Store.create({
      productName,
      price,
      stock,
      image: image ? `/uploads/${image}` : null,
    });

    res.status(201).json(newStore);
  } catch (error) {
    console.error("❌ Error in /store:", error);
    res
      .status(500)
      .json({ error: "Failed to create store item", details: error.message });
  }
});

// Delete a shoe by productName
const fs = require("fs");

app.delete("/store/:productName", async (req, res) => {
  const { productName } = req.params;

  try {
    const item = await Store.findOne({ where: { productName } });

    if (!item) {
      return res.status(404).send("Shoe not found.");
    }

    await Store.destroy({ where: { productName } });

    if (item.image) {
      const imagePath = path.join(__dirname, item.image);
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

app.put("/contact", async (req, res) => {
  const { phone, email } = req.body;

  try {
    let contact = await ContactInfo.findOne();

    if (!contact) {
      return res.status(404).json({ message: "Contact details not found" });
    }

    contact.phone = phone;
    contact.email = email;
    await contact.save();

    res.status(200).json({ message: "Contact details updated successfully" });
  } catch (error) {
    console.error("Error updating contact details:", error);
    res.status(500).json({ error: "Failed to update contact details" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
