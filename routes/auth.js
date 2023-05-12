const router = require("express").Router()
const { register, login, getCurrentLoggedInUser, logout } = require("../controllers/auth")
const { protect } = require("../middlewares/auth")

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(protect, logout)
router.route("/me").get(protect, getCurrentLoggedInUser)

module.exports = router
