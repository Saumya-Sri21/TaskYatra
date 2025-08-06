import { Task } from "../models/task.models.js";
import { User } from "../models/user.models.js";
import exceljs from 'exceljs'

//GET: /api/reports/export/tasks
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "name email");

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("Task Report");

        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 40 },
        ];

        tasks.forEach(task => {
            const assignedTo = task.assignedTo
                .map(user => `${user.name} (${user.email})`)
                .join(", ");

            worksheet.addRow({
                _id: task._id.toString(),
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
                assignedTo
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=task-report.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(`Task Report Generation Failed: ${error}`);
        return res.status(401).json({ success: false, message: "Task Report Generation Failed", error: error.message });
    }
}

// GET: /api/reports/export/users
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find();

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("User Report");

        worksheet.columns = [
            { header: "User ID", key: "_id", width: 25 },
            { header: "Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Role", key: "role", width: 15 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Pending Tasks", key: "pendingTasks", width: 18 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 18 },
        ];

        for (const user of users) {
            const [pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
                Task.countDocuments({ assignedTo: user._id, status: "Pending" }),
                Task.countDocuments({ assignedTo: user._id, status: "In Progress" }),
                Task.countDocuments({ assignedTo: user._id, status: "Completed" })
            ]);

            worksheet.addRow({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: new Date(user.createdAt).toLocaleString(),
                pendingTasks,
                inProgressTasks,
                completedTasks
            });
        }

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=user-report.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(`User Report Generation Failed: ${error}`);
        return res.status(401).json({
            success: false,
            message: "User Report Generation Failed",
            error: error.message
        });
    }
};

export { exportTaskReport, exportUsersReport };
