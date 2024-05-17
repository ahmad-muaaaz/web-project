import mongoose from "mongoose";

const loyaltyPointSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
        ref: "users",
    },

    pointsEarned:{
type: Number

    } ,
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("LoyaltyPoint", loyaltyPointSchema);

