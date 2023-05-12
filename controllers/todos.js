const Todo = require("../models/Todo")
const ErrorResponse = require("../utils/ErrorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const colors = require("colors")

//@desc     Get all todos
//@route    GET /api/v1/todos
//@access   Public
const getTodos = asyncHandler(async (req, res, next) => {
    res.status(200).send(res.advancedResults)
    console.log("The todos have been fetched successfully".green)
})

//@desc     Get a single todo
//@route    GET /api/v1/todos/:id
//@access   Public
const getTodo = asyncHandler(async (req, res, next) => {

    const todo = await Todo.findById(req.params.id)
    if (!todo) return next(new ErrorResponse(404, `Todo not found with id of ${req.params.id}`))

    res.status(200).send({ success: true, data: todo })
    console.log("The todo has been fetched successfully".green)
})

//@desc     Create a new todo
//@route    POST /api/v1/todos
//@access   Private

const createTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.create({ ...req.body, user: req.user.id })
    res.status(201).send({ success: true, data: todo })
    console.log("The todo has been created successfully".green)
})

//@desc     Update a todo
//@route    PUT /api/v1/todos/:id
//@access   Private
const updateTodo= asyncHandler(async (req, res, next) => {
    let todo = await Todo.findById(req.params.id)
    if (!todo) return next(new ErrorResponse(404, `todo not found with id of ${req.params.id}`))

    if (todo.user.toString() !== req.user.id) {
        return next(new ErrorResponse(401, "You are not authorized to update this todo"))
    }
    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).send({ success: true, data: todo })
    console.log("The todos has been updated successfully".green)
})

//@desc     Delete a todo
//@route    DELETE /api/v1/todos/:id
//@access   Private
const deleteTodo = asyncHandler(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id)
    if (!todo) return next(new ErrorResponse(404, `todo not found with id of ${req.params.id}`))

    if (todo.user.toString() !== req.user.id) {
        return next(new ErrorResponse(401, "You are not authorized to delete this todo"))
    }

    todo.remove()
    res.status(200).send({ success: true })
    console.log("The todos has been deleted successfully".green)
})


module.exports = {getTodos, getTodo, createTodo, updateTodo, deleteTodo}
