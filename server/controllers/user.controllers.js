import { User } from "../models/user.models.js";
import { Task } from "../models/task.models.js";
import bcrypt from "bcryptjs";

// GET: /api/users/
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        const UsersWithTaskCounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgress = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            return {
                ...user._doc,
                pendingTasks,
                inProgress,
                completedTasks
            };
        }));

        res.json({ success: true, users: UsersWithTaskCounts });
    } catch (error) {
        console.log(`Unable to get users: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to get users", error: error.message });
    }
};

// GET: /api/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        console.log(`Unable to get user by id: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to get user by id", error: error.message });
    }
};

export { getUsers, getUserById };
