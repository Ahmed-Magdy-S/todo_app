const express = require("express")
const  {getTodos, getTodo, createTodo, updateTodo, deleteTodo } = require("../controllers/todos")
const router = express.Router()
const advancedResults = require("../middlewares/advancedResults")
const Todo = require("../models/Todo")
const { protect } = require("../middlewares/auth")

router.route("/").get(advancedResults(Todo), getTodos).post(protect, createTodo)
router.route("/:id").get(getTodo).put(protect, updateTodo).delete(protect, deleteTodo)


module.exports = router
