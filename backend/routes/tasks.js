const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/',auth,async(req ,res)=>{
    try{
        const tasks = await Task.findAll({
            where:{user_id:req.user.id},
            order:[['created_at','DESC']]
        });

        const groupedTasks = {
            'To Do':tasks.filter(task=>task.status ==='To Do'),
            'In Progress':tasks.filter(task=>task.status==='In Progress'),
            'Done' : tasks.filter(task=>task.status==='Done')
        };
        res.json({
            message:'Tasks retrieved successfully',
            tasks:groupedTasks,
            totalTasks:tasks.length
        });

    }catch(error){
        console.error('Get tasks error: ',error);
        res.status(500).json({message:'Server error while fetching tasks'});
    }
});

router.post('/',auth,async(req,res)=>{
    try{
        const {title} = req.body;
        
        // validate input
        if(!title || title.trim()===''){
            return res.status(400).json({
                message:'Title is required'
            });
        }

        // create a new task
        const task = await Task.create({
            title:title.trim(),
            user_id:req.user.id
        });

        res.status(201).json({
            message:'Task created successfully',
            task:{
                id:task.id,
                title:task.title,
                status:task.status,
                created_at :task.created_at
            }
        });
    }catch(error){
console.error('Create task error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating task' });    }
});

router.put('/:id',auth,async(req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;

        const validateStatuses = ['To Do','In Progress','Done'];
        if(!status ||!validateStatuses.includes(status)){
            return res.status(400).json({ 
        message: 'Invalid status. Must be one of: To Do, In Progress, Done' 
        });
    }

    const task = await Task.findOne({
        where:{
            id, user_id:req.user.id
        }
    });
    if(!task){
        return res.status(404).json({
            message: 'Task not found' 
        });
    }
    // update task status
    task.status = status
 await task.save();

    res.json({
      message: 'Task status updated successfully',
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
        created_at: task.created_at
      }
    });
}catch(error){
     console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
    }
});

router.delete('/:id',auth,async(req,res)=>{
    try{
const {id}= req.params;

// find and delete teask
const task = await Task.findOne({
    where:{
        id,
        user_id:req.user.id
    }
});
if(!task){
    return res.status(404).json({
        message:'Tsk not found'
    });
}
await task.destroy();

    res.json({
        message:'Task deleted successfully'
    });

    }
    catch(error){
        console.error('Delete task error',error);
        res.status(500).json({ message:'Server error while deleting task'
        }); 
    }
});
module.exports = router;