const express = require('express');
const router = express.Router()
const axios = require('axios');

const url = 'https://api.konduto.com/v1/orders';
const privateKey = process.env.PRIVATE_KEY;

router.post('/order', async (req, res) => {
    
    const order = await req.body;
    const orderID = order.id;


    if(order.value == undefined){
        res.sendStatus(400);
        return;
    }
    
    var sendOrder = await sendAPI(url, privateKey, order);
    
    var status = sendOrder.data.order.status;
    
    if(status === 'declined' || status === 'approved'){
        res.status(200).json({status});
        return;
    }

    var getStatus = setInterval(async() => {
        var getOrder = await getAPI(url, privateKey, orderID);
        var status = getOrder.data.order.status;

        if(status === 'declined' || status === 'approved'){
            res.status(200).json({status});
            stop(getStatus);
        } 
    
    }, 10000);

});


async function sendAPI(url, privateKey, order) {
    try{
        var response = await axios.post(url, order, {auth: { username: `${privateKey}`,  password: ''}});
        return response;

    }catch(err){
        return err;
    }

};
    

async function getAPI(url, privateKey, orderID) {
    try{
        var response = await axios.get(`${url}/${orderID}`,{auth: { username: `${privateKey}`,  password: ''}});
        return response;

    }catch(err){
        return err;
    }

}
function stop(params) {
    clearInterval(params);
};

module.exports = router;