import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const generateTokens = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '10d' });
    return token;
};

// POST: /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageURL, adminInviteToken } = req.body;

        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "User Already Exist" });

        let role = "user";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_TOKEN) role = "admin";

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword, profileImageURL, role });

        if (!newUser) return res.status(401).json({ success: false, message: "Unable to register user" });

        res.status(200).json({
            success: true,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            profileImageURL: newUser.profileImageURL,
            token: generateTokens(newUser._id),
            message: "User Registered Successfully"
        });

    } catch (error) {
        console.log(`Unable to register User:${error}`);
        return res.status(401).json({ success: false, message: "Unable to register User", error: error.message });
    }
};

// POST: /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "Invalid Email!!" });

        const isCorrect = await bcryptjs.compare(password, user.password);
        if (!isCorrect) return res.status(404).json({ success: false, message: "Invalid Password!!" });

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageURL: user.profileImageURL,
            token: generateTokens(user._id),
            message: "User log in Successfully"
        });

    } catch (error) {
        console.log(`Unable to login User:${error}`);
        return res.status(401).json({ success: false, message: "Unable to login User", error: error.message });
    }
};

// GET: /api/auth/profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(401).json({ success: false, message: "Unable to get user details!!" });

        return res.status(200).json(user);

    } catch (error) {
        console.log(`Unable to get user's profile:${error}`);
        return res.status(401).json({ success: false, message: "Unable to get user's profile", error: error.message });
    }
};

// PUT: /api/auth/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ success: false, message: "User Not found!!" });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            user.password = await bcryptjs.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImageURL: updatedUser.profileImageURL,
            token: generateTokens(updatedUser._id),
        });

    } catch (error) {
        console.log(`Unable to update user's profile:${error}`);
        return res.status(401).json({ success: false, message: "Unable to update user's profile", error: error.message });
    }
};

export { registerUser, loginUser, getUserProfile, updateUserProfile };
