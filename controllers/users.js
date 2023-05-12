const User = require("../models/User")
const ErrorResponse = require("../utils/ErrorResponse")
const asyncHandler = require("../middlewares/asyncHandler")
const { sendTokenResponse } = require("../utils/sendTokenResponse")
const colors = require("colors")


//@desc     Update User Details
//@route    PUT /api/v1/users/update
//@access   Private
const updateUserDetails = asyncHandler(async (req, res, next) => {
    const allowedUpdates = {
        name: req.body.name,
        email: req.body.email
    }

    let user = await User.findById(req.user.id)
    if (!user) return next(new ErrorResponse(404, "The user is not exist"))

    user = await User.findByIdAndUpdate(req.user.id, allowedUpdates, {
        new: true, runValidators: true
    }).select("-password")


    res.status(200).send({ success: true, data: user })

    console.log("User details has been updated successfully".green)
})


//@desc     Update Password
//@route    PUT /api/v1/users/updatepassword
//@access   Private
const updateUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    if (!user) return next(new ErrorResponse(404, "The user is not exist"))

    //check current password
    const isMatchedPassword = await user.matchPassword(req.body.currentPassword)
    if (!isMatchedPassword) return next(new ErrorResponse(400, "Wrong Password"))


    user.password = req.body.newPassword

    await user.save()

    sendTokenResponse(user, 200, res)
    console.log("User password has been updated successfully".green)

})


//@desc     Get All Users
//@route    GET /api/v1/users
//@access   Private
const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).send(res.advancedResults)
    console.log("All User have been fetched successfully".green)
})


//@desc     Get a user
//@route    GET /api/v1/users/:id
//@access   Private
const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorResponse(404, "The user is not exist"))

    res.status(200).send({ success: true, data: user })
    console.log("The User has been fetched successfully".green)
})

//@desc     Create a user
//@route    POST /api/v1/users
//@access   Private
const createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(201).send({ success: true, data: user })
    console.log("The User has been created successfully".green)
})

//@desc     update a user
//@route    PUT /api/v1/users/:id
//@access   Private
const updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id)

    if (!user) return next(new ErrorResponse(404, "The user is not exist"))

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true
    })


    res.status(200).send({ success: true, data: user })
    console.log("The User has been updated successfully".green)
})


//@desc     DELETE a user
//@route    DELETE /api/v1/users/:id
//@access   Private
const deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, data: "User has been deleted" })
    console.log("The User has been deleted successfully".green)
})


module.exports = {
    updateUserDetails, updateUserPassword, getUsers, getUser, createUser, updateUser, deleteUser
}
