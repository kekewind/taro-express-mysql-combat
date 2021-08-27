const express = require("express");
const router = express.Router();
const axios = require("axios")
const sqlQuery = require("../mysql");




router.post("/login", async (req, res) => {
  // req.session.username - "yb"
})

module.exports = router;