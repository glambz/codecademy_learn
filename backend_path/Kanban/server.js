const express = require('express');
const app = express();
const {topupSource, topupCategory, addNewCategory, addEnvelope, getCategories, getSource, getEnvelopes} = require('./server/db')

module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 3000;

// Add middleware for handling CORS requests from index.html
const cors = require('cors')
app.use(cors());

// Add middware for parsing request bodies here:
const bodyParser = require('body-parser')
app.use(bodyParser.json());

app.param('envId', (req, res, next, value)=>{
    try{
        const envId = Number(value);
        if(envId>0){
            req.envId = envId;
            next();
        }else{
            res.status(404).send('Envelope id not valid')
        }
    }catch (e){
        res.status(404).send('Envelope id not valid')
    }
})

app.param('cat', (req, res, next, value)=>{
            req.category = value;
            next();
})

const getSourceAPI = (req, res, next)=>{
    const result = getSource();
    if(result.success){
        res.send(result.data);
    }else{
        res.status(404).send(result.message || 'not found');
    }
}

const getCategoriesAPI = (req, res, next)=>{
    const result = getCategories(req.category);
    if(result.success && req.category){
        req.categoryData = result.data;
        next()
    }else if(result.success){
        res.send(result.data);
    }else{
        res.status(404).send(result.message);
    }
}

const addSourceBalanceAPI = (req, res, next)=>{
    const result = topupSource(req.body);
    if(result.success){
        res.send(result.message);
    }else{
        res.status(404).send(result.message)
    }
}

const addCategoryAPI = (req, res, next)=>{
    const result = addNewCategory(req.body);
    if(result.success){
        res.send(result.message);
    }else{
        res.status(404).send(result.message);
    }
}

const getEnvelopesAPI = (req, res, next)=>{
    const result = getEnvelopes(req.category);
    if(result.success){
        res.send(result.data)
    }else{
        res.status(404).send(result.message)
    }
}

const addCategoryBalanceAPI = (req, res, next)=>{
    req.body.category = req.category;
    const result = topupCategory(req.body)
    if(result.success){
        res.send(result.message);
    }else{
        res.status(404).send(result.message);
    }
}

const addUpEnvelopeAPI = (req, res, next)=>{
    req.body.category = req.category;
    req.body.envId = req.envId ? req.envId : undefined;
    const result = addEnvelope(req.body);
    if(result.success){
        res.send(result.message);
    }else{
        res.status(404).send(result.message)
    }
}

app.get('/', getSourceAPI)

app.get('/envelopes', getCategoriesAPI)

app.post('/envelopes', addCategoryAPI)

app.put('/envelopes', addSourceBalanceAPI)

app.get('/envelopes/:cat', getEnvelopesAPI)

app.put('/envelopes/:cat', getCategoriesAPI, addCategoryBalanceAPI)

app.post('/envelopes/:cat', addUpEnvelopeAPI)

app.get('/envelopes/:cat/:envId', )

app.put('/envelopes/:cat/:envId', addUpEnvelopeAPI)

    app.listen(PORT, ()=>{
        console.log('asdu');
    });
