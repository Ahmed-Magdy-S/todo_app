const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 charcaters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
        maxlength: [500, 'Name cannot be more than 500 charcaters']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

module.exports = mongoose.model("Todo", schema)
