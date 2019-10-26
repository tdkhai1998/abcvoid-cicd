var express = require('express');
var router = express.Router();
const keyModel = require("../../model/key.model");
/* GET users listing. */
router.get('/:id',async (req, res,next) => {

    const id = req.params.id;
    if(!id)
    {
       return res.sendStatus(404);
    }
    try {
        const key = await keyModel.singleById(id);
    } catch (error) {
        
    }
    
    const path = `${key.price}`
});

module.exports = router;
