import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    datetime: { type: Date, default: Date.now },
});

export interface IUser {
    username: string;
    password: string;
    datetime: Date;
};

const User = mongoose.model("User", userSchema);
export default User;