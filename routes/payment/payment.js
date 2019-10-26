var express = require('express');
var router = express.Router();
const keyModel = require("../../model/key.model");
const toFunc = require("../../util/toFunction")

const getInfoApiKey = async (req, res,next) => {
    const id = req.params.id;
    const key = await toFunc(keyModel.singleById(id));
    if(key[0]){
       return  {error: key[0]}
    }   
    const data=key[1];
    const path =  `/img/${data.price}.png`;
    return {error: null,data,path};
}
router.get('/:id',async (req, res,next) => {
    const  {data, path,error}= getInfoApiKey(req, res,next);
    if(error) return next(result.error);
    res.render("/payment/payment",{
        price:data.price,
        imgSrc: path
    })
});
router.post('/:id',async (req,res,next) => {
    const transactionId= req.body.transactionId||"";
    const  {data, path,error} = getInfoApiKey(req, res,next);
    if(error) return next(result.error);
    if(data.transactionId === transactionId) 
    {
        data.valid = true;
        data.transactionId = null;
        keyModel.update('api_key', 'id', data);
        return res.redirect("/profile");
    }    
    res.render("/payment/payment",{
        price:data.price,
        imgSrc: path,
        message: "Mã giao dịch không khớp !!!!"
    })



})

module.exports = router;
