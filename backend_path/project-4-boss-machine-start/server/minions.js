const express = require('express');
const minionRouter = express.Router();
const {getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId} = require('./db')
const minionWork = require('./minionWork')
const modelType = 'minions'

minionRouter.param('minionId', (req, res, next, value)=>{
    try{
        const minionId = Number(value);
        if(minionId>0){
            req.minionId = value;
            next();
        }else{
            res.status(404).send('minion id not valid')
        }
    }catch (e){
        res.status(404).send('minion id not valid')
    }
})

minionRouter.use('/:minionId/work', minionWork)

minionRouter.get('', (req,res,next)=>{
    const data = getAllFromDatabase(modelType);
    if(data){
        res.send(data);
    }else{
        res.status(404).send('data not found')
    }
})

minionRouter.post('', (req,res,next)=>{
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

minionRouter.get('/:minionId', (req, res, next)=>{
    const minionGot = getFromDatabaseById(modelType, req.minionId);
    console.log(req.minionId)
    console.log(minionGot)
    if(minionGot){
        res.send(minionGot);
    }else{
        res.status(404).send('minion not found')
    }
})

minionRouter.put('/:minionId', (req, res, next)=>{
    try{
        const temp = req.body;
        temp.id = req.minionId;
        const minion = updateInstanceInDatabase(modelType, temp);
        if(minion){
            res.send(minion)
        }else{
            res.status(404).send('minion not found')
        }
    }catch (e){
        res.status(500).send(e.message);
    }
})

minionRouter.delete('/:minionId', (req, res, next)=>{
    const deleted = deleteFromDatabasebyId(modelType, req.minionId)
    console.log(deleted)
    if(deleted){
        res.status(204).send({message:'minion deleted successfully'});
    }else{
        res.status(404).send('minion not found')
    }
})

module.exports = minionRouter;