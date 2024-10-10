const express = require('express');
const meetingRouter = express.Router();
const {getAllFromDatabase, addToDatabase, deleteAllFromDatabase, createMeeting} = require('./db')
const modelType = 'meetings'

meetingRouter.param('meetingId', (req, res, next, value)=>{
    try{
        const meetingId = Number(value);
        if(meetingId>0){
            req.meetingId = value;
            console.log(meetingId);
            next();
        }else{
            res.status(404).send('meeting id not valid')
        }
    }catch (e){
        res.status(404).send('meeting id not valid')
    }
})

meetingRouter.get('', (req,res,next)=>{
    const data = getAllFromDatabase(modelType);
    if(data){
        res.send(data);
    }else{
        res.status(404).send('data not found')
    }
})

meetingRouter.post('', (req,res,next)=>{
    try{
        const meet = createMeeting();
        const result = addToDatabase(modelType, meet);
        console.log(result)
        if(result){
            res.status(201).send(result);
        }else{
            res.status(500).send('model not found')
        }
    }catch (e){
        res.status(500).send(e.message)
    }
})

meetingRouter.delete('', (req, res, next)=>{
    const deleted = deleteAllFromDatabase(modelType)
    console.log(deleted)
    if(deleted){
        res.status(204).send({message:'meeting deleted successfully'});
    }else{
        res.status(404).send('meeting not found')
    }
})

module.exports = meetingRouter;