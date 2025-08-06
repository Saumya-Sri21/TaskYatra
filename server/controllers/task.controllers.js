// import { Task } from "../models/task.models.js"

// //GET: /api/taks
// const getTasks=async(req,res)=>{
//     try {

//         const {status} =req.query;
//         let filter;

//         if(status) filter.status=status;

//         let tasks;
//         if(req.user.role==="admin"){
//             tasks=await Task.find(filter).populate(
//                 "assignedTo",
//                 "name email profileImageURL"
//             );
//         }else{
//             tasks=Task.find({...filter,assginedTo:req.user._id}).populate(
//                 "assignedTo",
//                 "name email profileImageURL"
//             )
//         }

//         tasks=await Promise.all(
//             tasks.map(async(task)=>{
//                 const completedCount=task.todoList.filter(
//                     (item)=>item.completed
//                 ).length;
//                 return {...task.doc, completedTodoCount:completedCount}
//             })
//         )

//         const allTasks=await Task.countDocuments(
//             req.user.role==="admin"?{}:{assginedTo:req.user._id}
//         )

//         const pendingTasks= await Task.countDocuments({
//             ...filter,
//             status:"Pending",
//             ...(req.user.role==="admin" && {assginedTo:req.user._id})
//         });
        
//         const inprogressTasks= await Task.countDocuments({
//             ...filter,
//             status:"In Progress",
//             ...(req.user.role==="admin" && {assginedTo:req.user._id})
//         });

//         const completedTasks= await Task.countDocuments({
//             ...filter,
//             status:"Completed",
//             ...(req.user.role==="admin" && {assginedTo:req.user._id})
//         });

//         return res.status(200).json({ success: true, statusSummary:{
//             all:allTasks,
//             pendingTasks,
//             inprogressTasks,
//             completedTasks
//         } });
        
//     } catch (error) {
//         console.log(`Unable to get tasks:${error}`)
//         return res.status(401).json({ success: false, message: "Unable to get tasks", error: error.message })
//     }
// }

// //GET: /api/taks/:id
// const getTaskById=async(req,res)=>{

//     try {

//          const task = await Task.findById(req.params.id).populate(
//                 "assignedTo",
//                 "name email profileImageURL"
//             );
//         if (!task) return res.status(404).json({ success: false, message: "Task not found" });
//         return res.status(200).json({ success: true, task });
        
//     } catch (error) {
//         console.log(`Unable to get user's tasks:${error}`)
//         return res.status(401).json({ success: false, message: "Unable to get user's tasks", error: error.message })
   
//     }

// }

// //POST: /api/taks/
// const createTask=async(req,res)=>{

//     try {

//         const { title, description, priority, status, dueDate, assginedTo, attachments, todoList } = req.body;

//         if (!Array.isArray(assginedTo)) {
//             return res.status(400).json({ success: false, message: "AssignedTo must be an array of user id" });
//         }

//         const task = await Task.create({
//             title,
//             description,
//             priority,
//             status,
//             dueDate,
//             assginedTo,
//             createdBy: req.user._id,
//             todoList,
//             attachments
//         });

//         return res.status(200).json({ success: true, message: "Task created successfully", task });
    
//     } catch (error) {
        
//         console.log(`Unable to create tasks:${error}`)
//         return res.status(401).json({ success: false, message: "Unable to create tasks", error: error.message })
   
//     }

// }

// //PUT: /api/taks/:id
// const updateTask=async(req,res)=>{

//     try {

//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ success: false, message: "Task not found" });

//         task.title=req.body.title||task.title;
//         task.description=req.body.description || task.description;
//         task.priority=req.body.priority || task.priority;
//         task.dueDate=req.body.dueDate || task.dueDate
//         task.todoList=req.body.todoList || task.todoList
//         task.attachments= req.body.attachments || task.attachments

//         if(req.body.assginedTo){
//             if(!Array.isArray(assginedTo)){
//                 return res.status(400).json({message:"assigned to must be an array"})
//             }

//             task.assginedTo=req.body.assginedTo;
//         }

//         const updateTask=await task.save();
//         return res.status(200).json({ success: true, message: "Task updated", task });
    
        
//     } catch (error) {
//         console.log(`Unable to update tasks:${error}`)
//         return res.status(401).json({ success: false, message: "Unable to update tasks", error: error.message })
   
//     }

// }

// //DELETE: /api/taks/:id
// const deleteTask=async(req,res)=>{

//     try {

//          const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ success: false, message: "Task not found" });

//         await task.deleteOne(); 
//         return res.status(200).json({ success: true, message: "Task deleted" });
        
//     } catch (error) {
//         console.log(`Not able to delete the task:${error}`)
//         return res.status(401).json({ success: false, message: "Not able to delete the task", error: error.message })
   
//     }

// }

// //PUT: /api/taks/:id/status
// const updateTaskStatus=async(req,res)=>{

//     try {

//         const { status } = req.body;
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ success: false, message: "Task not found" });

//         task.status = status;
//         await task.save();

//         return res.status(200).json({ success: true, message: "Task status updated", task });
    
        
//     } catch (error) {
//         console.log(`Not able to update the task status:${error}`)
//         return res.status(401).json({ success: false, message: "Not able to update the task status", error: error.message })
   
//     }

// }

// //PUT: /api/taks/:id/todo
// const updateTaskChecklist=async(req,res)=>{
//         try {

//             const { todoList } = req.body;
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ success: false, message: "Task not found" });

//         task.todoList = todoList;
//         await task.save();

//         return res.status(200).json({ success: true, message: "Checklist updated", task });
            
//         } catch (error) {
//             console.log(`Not able to update the task-checklist:${error}`)
//             return res.status(401).json({ success: false, message: "Not able to update the task-checklist", error: error.message })
   
//         }
// }

// //GET: /api/taks/dashboard-data
// const getDashboardData=async(req,res)=>{
//     try {

//         const totalTasks = await Task.countDocuments();
//         const completed = await Task.countDocuments({ status: 'Completed' });
//         const pending = await Task.countDocuments({ status: 'Pending' });

//         return res.status(200).json({ success: true, totalTasks, completed, pending });
        
//     } catch (error) {
//         console.log(`Unable to get dashboard data:${error}`)
//         return res.status(401).json({ success: false, message: "Unable to get dashboard data", error: error.message })
        
//     }

// }
// //GET: /api/taks/user-dashboard-data
// const getUserDashboardData=async(req,res)=>{

//     try {

//         const userId = req.user._id;
//         const tasks = await Task.find({ assginedTo: userId });

//         const completed = tasks.filter(t => t.status === 'Completed').length;
//         const pending = tasks.filter(t => t.status === 'Pending').length;

//         return res.status(200).json({ success: true, totalTasks: tasks.length, completed, pending });
    
        
//     } catch (error) {
        
//         console.log(`Unable to get dashboard data:${error}`)
//         return res.status(401).json({ success: false, message: "Unable to get dashboard data", error: error.message })
        
//     }

// }

// export {
//     getTasks,
//     getTaskById,
//     createTask,
//     updateTask,
//     deleteTask,
//     updateTaskStatus,
//     updateTaskChecklist,
//     getDashboardData,
//     getUserDashboardData
// };

import { Task } from "../models/task.models.js"

// GET: /api/tasks
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) filter.status = status;

        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageURL"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageURL"
            );
        }

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoList.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const inprogressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        return res.status(200).json({
            success: true,
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inprogressTasks,
                completedTasks
            }
        });

    } catch (error) {
        console.log(`Unable to get tasks: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to get tasks", error: error.message });
    }
};

// GET: /api/tasks/:id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageURL"
        );
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });
        return res.status(200).json({ success: true, task });
    } catch (error) {
        console.log(`Unable to get user's tasks: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to get user's tasks", error: error.message });
    }
};

// POST: /api/tasks/
const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate, assignedTo, attachments, todoList } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ success: false, message: "AssignedTo must be an array of user id" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoList,
            attachments
        });

        return res.status(200).json({ success: true, message: "Task created successfully", task });
    } catch (error) {
        console.log(`Unable to create tasks: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to create tasks", error: error.message });
    }
};

// PUT: /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoList = req.body.todoList || task.todoList;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assignedTo must be an array" });
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        return res.status(200).json({ success: true, message: "Task updated", task: updatedTask });
    } catch (error) {
        console.log(`Unable to update tasks: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to update tasks", error: error.message });
    }
};

// DELETE: /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        await task.deleteOne();
        return res.status(200).json({ success: true, message: "Task deleted" });
    } catch (error) {
        console.log(`Not able to delete the task: ${error}`);
        return res.status(401).json({ success: false, message: "Not able to delete the task", error: error.message });
    }
};

// PUT: /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        task.status = status;
        await task.save();

        return res.status(200).json({ success: true, message: "Task status updated", task });
    } catch (error) {
        console.log(`Not able to update the task status: ${error}`);
        return res.status(401).json({ success: false, message: "Not able to update the task status", error: error.message });
    }
};

// PUT: /api/tasks/:id/todo
const updateTaskChecklist = async (req, res) => {
    try {
        const { todoList } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        task.todoList = todoList;
        await task.save();

        return res.status(200).json({ success: true, message: "Checklist updated", task });
    } catch (error) {
        console.log(`Not able to update the task-checklist: ${error}`);
        return res.status(401).json({ success: false, message: "Not able to update the task-checklist", error: error.message });
    }
};

// GET: /api/tasks/dashboard-data
const getDashboardData = async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completed = await Task.countDocuments({ status: 'Completed' });
        const pending = await Task.countDocuments({ status: 'Pending' });

        return res.status(200).json({ success: true, totalTasks, completed, pending });
    } catch (error) {
        console.log(`Unable to get dashboard data: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to get dashboard data", error: error.message });
    }
};

// GET: /api/tasks/user-dashboard-data
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ assignedTo: userId });

        const completed = tasks.filter(t => t.status === 'Completed').length;
        const pending = tasks.filter(t => t.status === 'Pending').length;

        return res.status(200).json({ success: true, totalTasks: tasks.length, completed, pending });
    } catch (error) {
        console.log(`Unable to get dashboard data: ${error}`);
        return res.status(401).json({ success: false, message: "Unable to get dashboard data", error: error.message });
    }
};

export {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};
