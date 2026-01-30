const express = require("express");
const router = express.Router();


const {getAllLaptops} = require("../controllers/laptopController");

router.get("/laptops",require("../middleware/authMiddleware"),getAllLaptops);

module.exports = router;