const express = require('express');
const ideaRouter = express.Router();
const {getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId} = require('./db')
const checkMillionDollarIdea = require('./checkMillionDollarIdea')
const modelType = 'ideas'

ideaRouter.param('ideaId', (req, res, next, value)=>{
    try{
        const ideaId = Number(value);
        if(ideaId>0){
            req.ideaId = value;
            console.log(ideaId);
            next();
        }else{
            res.status(404).send('Idea id not valid')
        }
    }catch (e){
        res.status(404).send('Idea id not valid')
    }
})

ideaRouter.get('', (req,res,next)=>{
    const data = getAllFromDatabase(modelType);
    if(data){
        res.send(data);
    }else{
        res.status(404).send('data not found')
    }
})

ideaRouter.post('', checkMillionDollarIdea, (req,res,next)=>{
    try{
        console.log(req.body)
        const result = addToDatabase(modelType, req.body);
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

ideaRouter.get('/:ideaId', (req, res, next)=>{
    const ideaGot = getFromDatabaseById(modelType, req.ideaId);
    console.log(req.ideaId)
    console.log(ideaGot)
    if(ideaGot){
        res.send(ideaGot);
    }else{
        res.status(404).send('idea not found')
    }
})

ideaRouter.put('/:ideaId', (req, res, next)=>{
    try{
        const temp = req.body;
        temp.id = req.ideaId;
        const idea = updateInstanceInDatabase(modelType, temp);
        if(idea){
            res.send(idea)
        }else{
            res.status(404).send('idea not found')
        }
    }catch (e){
        res.status(500).send(e.message);
    }
})

ideaRouter.delete('/:ideaId', (req, res, next)=>{
    const deleted = deleteFromDatabasebyId(modelType, req.ideaId)
    console.log(deleted)
    if(deleted){
        res.status(204).send({message:'idea deleted successfully'});
    }else{
        res.status(404).send('idea not found')
    }
})

module.exports = ideaRouter;