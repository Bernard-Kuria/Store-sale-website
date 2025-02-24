// Import dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const compression = require("compression");
require("dotenv").config();

console.log("Database URL:", process.env.DATABASE_URL);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

const tinify = require("tinify");
tinify.key = process.env.TINIFY_API_KEY;

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
  // dialectOptions: process.env.DATABASE_URL
  //   ? { ssl: { require: true, rejectUnauthorized: false } } // Enable SSL only for Railway
  //   : {}, // No SSL for local PostgreSQL
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
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");

    console.log("Saving file to:", uploadPath);

    if (!fs.existsSync(uploadPath)) {
      console.log("Uploads folder does not exist, creating it...");
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log("Generated filename:", uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images (JPEG, JPG, PNG, WEBP) are allowed"));
    }
  },
}).single("image");

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
app.post("/store", (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const compressedPath = path.join(
      __dirname,
      "uploads",
      "compressed-" + req.file.filename
    );

    try {
      await tinify.fromFile(inputPath).toFile(compressedPath);

      fs.unlink(inputPath, (err) => {
        if (err) console.error("Failed to delete original file:", err);
      });

      const newItem = await Store.create({
        productName: req.body.productName,
        price: req.body.price,
        stock: req.body.stock,
        image: `/uploads/compressed-${req.file.filename}`,
      });

      res.json(newItem);
    } catch (error) {
      console.error("Tinify error:", error);
      res.status(500).json({ error: "Image compression failed" });
    }
  });
});

// Delete a shoe by productName
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
