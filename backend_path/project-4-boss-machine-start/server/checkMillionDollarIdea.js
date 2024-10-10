const checkMillionDollarIdea = (req, res, next) => {
    try{
        const numWeeks = Number(req.body.numWeeks);
        const weeklyRevenue = Number(req.body.weeklyRevenue)
        if(numWeeks && weeklyRevenue && weeklyRevenue * numWeeks >= 1000000){
            next()
        }else{
            res.status(400).send('not a million dollar idea')
        }
    }catch(e){
        res.status(400).send('not a million dollar idea')
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
