import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,

    },

    address: {
        type: {},
        required: true,

    },


    answer: {
        type: String,
        required: true,

    },

    phone: {
        type: Number,
        required: true,

    },

    role: {
        type: Number,
        default: 0,

    },

    loyaltyPoints: {
        type: Number,
        default: 0,
    },
    discountApplied: {
        type: Boolean,
        default: false,
      },



}
    , { timestamps: true }

)

export default mongoose.model('users', userSchema)