const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 1. Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Folder to save files
  },
  filename: function (req, file, cb) {
    // Rename file: image-168383882.png
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// 2. Create upload middleware
const upload = multer({ storage: storage });

// 3. POST route with error handling
router.post("/image", (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: "Multer error", error: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    res.json({
      message: "File uploaded successfully!",
      file: req.file,
    });
  });
});

module.exports = router;