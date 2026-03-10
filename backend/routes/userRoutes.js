const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { getUsers, getMe } = require("../controllers/userController");

router.get("/", auth, getUsers);
router.get("/me", auth, getMe);

module.exports = router;
