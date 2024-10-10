const express = require('express');
const workRouter = express.Router();
const {getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabasebyId} = require('./db')
const modelType = 'work'

const checkMinionId = (req,res,next)=>{
    if(getFromDatabaseById('minions', req.minionId)){
        next();
    }else{
        res.status(404).send('invalid minion id')
    }
}

const checkWorkId = (req,res,next)=>{
    if(getFromDatabaseById(modelType, req.workId)){
        next();
    }else{
        res.status(404).send('invalid work id')
    }
}

const checkCorrectMinionAndWork = (req,res,next)=>{
    if(getFromDatabaseById(modelType, req.workId).minionId === req.minionId){
        next();
    }else{
        res.status(400).send('invalid match of work id and minion id')
    }
}

workRouter.param('workId', (req, res, next, value)=>{
    try{
        const workId = Number(value);
        if(workId>0){
            req.workId = value;
            console.log(workId);
            next();
        }else{
            res.status(404).send('work id not valid')
        }
    }catch (e){
        res.status(404).send('work id not valid')
    }
})

workRouter.get('', checkMinionId, (req,res,next)=>{
    try{
        console.log(req.minionId)
        const data = getAllFromDatabase(modelType);
        const filteredData = data.filter((x) => x.minionId === req.minionId)
        if(filteredData){
            res.send(filteredData);
        }else{
            res.status(404).send('data not found')
        }
    }catch (e){
        res.status(400).send('data not found')
    }
})

workRouter.post('', checkMinionId, (req,res,next)=>{
    try{
        console.log(req.body)
        req.body.minionId = req.minionId
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

workRouter.put('/:workId', checkMinionId, checkWorkId, checkCorrectMinionAndWork, (req, res, next)=>{
    try{
                const temp = req.body;
                temp.id = req.workId;
                temp.minionId = req.minionId
                const work = updateInstanceInDatabase(modelType, temp);
                if(work){
                    res.send(work)
                }else{
                    res.status(404).send('work not found')
                }
    }catch (e){
        res.status(500).send(e.message);
    }
})

workRouter.delete('/:workId', checkMinionId, checkWorkId,  (req, res, next)=>{
    const deleted = deleteFromDatabasebyId(modelType, req.workId)
    console.log(deleted)
    if(deleted){
        res.status(204).send({message:'work deleted successfully'});
    }else{
        res.status(404).send('work not found')
    }
})

module.exports = workRouter;