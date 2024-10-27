/* db details
source {totalBalance, remainingBalance}
envDetails {category, totalBalance, remainingBalance}
envelope {id, category, label, price, desc}
*/
const balanceSource = {totalBalance: 0, remainingBalance: 0}
const envDetails = {}
const envelope = {}
let idEnvDetailsCount = 1;
let idEnvCount = 1;

const checkAmount = (amount)=>{
    try{
        const temp = Number(amount);
        return (typeof temp).toLowerCase() === 'number';
    }catch (e){
        return false;
    }
}


const checkCategoryExist = (category)=>{
    return envDetails[category];
}

const checkEnvDetailValid = (body)=>{
    return !!body.category;
}

const checkEnvLabel = (body)=>{
    return !!body.label;
}

const checkEnvExist = (id)=>{
    if(envelope[id]){
        return true
    }else{
        return false;
    }
}

const topupSource = (body)=>{
    try{
        const temp = Number(body.amount);
        balanceSource.totalBalance += temp;
        balanceSource.remainingBalance += temp;
        return {success: true, message: `topup ${temp} successful`}
    }catch(e){
        return {success : false, message : 'please provide correct amount'}
    }
}

const addNewCategory = (body)=>{
    if(!checkEnvDetailValid(body)){
        return {success: false, message: 'Category not valid'}
    }
    const exist = checkCategoryExist(body.category);
    if(exist){
        return {success: false, message: 'Category already exist'}
    }else{
        body.id = idEnvDetailsCount
        envDetails[body.category] = body;
        envDetails[body.category].remainingBalance = 0
        envDetails[body.category].totalBalance = 0
        idEnvDetailsCount ++;
        return {success: true, message: `Category ${body.category} added`}
    }
}

const topupCategory = (body)=>{
    if(!checkAmount(body.amount)){
        return {success: false, message: 'Please provide correct amount'}
    }else{
        body.amount = Number(body.amount);
    }
    if(!checkEnvDetailValid(body)){
        return {success: false, message: 'Category not valid'}
    }
    if(!checkCategoryExist(body.category)){
        return {success: false, message: 'Category does not exist'}
    }else{
        envDetails.totalBalance += body.amount;
        envDetails.remainingBalance += body.amount;
        balanceSource.remainingBalance -= body.amount;
    }
}

const addEnvelope = (body) => {
    if(!checkAmount(body.amount)){
        return {success: false, message: 'Please provide correct amount'}
    }else{
        body.amount = Number(body.amount);
    }
    if(!checkEnvDetailValid(body)){
        return {success: false, message: 'Category not valid'}
    }
    if(!checkEnvLabel(body)){
        return {success: false, message: 'Envelope label not valid'}
    }
    if(!checkCategoryExist(body.category)){
        return {success: false, message: 'Category does not exist'}
    }else{
        const addup = !body.id
        body.id = body.id || idEnvCount;
        const temp = {id:body.id, category:body.category, label:body.label, price:body.amount, desc: body.desc};
        envelope[body.id] = temp;
        envDetails[body.category].remainingBalance -= body.amount
        if(addup){
            idEnvCount++;
        }
        return {success: true, message: 'Envelope added successfully', data: temp}
    }
}

const getCategories = (category = null)=>{
    if(category && envDetails[category]){
        return {success: true, data:envDetails[category]};
    }else if(!category){
        return {success: true, data: Object.keys(envDetails).map((key) => envDetails[key])};
    }else{
        return {success: false, message: 'data not found'}
    }
}

const getSource = ()=>{
    return {success: true, data: balanceSource};
}

const getEnvelopes = (category = null, idEnvelope = null)=>{
    if(idEnvelope && !checkEnvExist(idEnvelope)){
        return {success: false, message: 'envelope not found!'}
    }
    if(category && idEnvelope && envelope[id].category === category){
        return {success: true, data: envelope[idEnvelope]};
    }else if(category && !idEnvelope){
        return {success: true, data: Object.keys(envelope).map((key) => {
                if(envelope[key].category === category){
                    return envelope[key];
                }
            })
            };
    }else{
        return {success: false, message: 'error, category and envelope doesn\'t match!'}
    }
}

module.exports = {
    topupSource,
    topupCategory,
    addNewCategory,
    addEnvelope,
    getCategories,
    getSource,
    getEnvelopes
};