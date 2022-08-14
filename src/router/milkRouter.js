const express = require("express");
const Milk = require("../models/milk");
const helper=require("../helper")
const router = new express.Router();


// add milk



router.get("/checkCapacity/:date",async(req,res)=>{
  try {
    const milk=await Milk.findOne({createdAt:{ $gte : req.params.date}})
    if(milk===null || helper.matchDate(milk.createdAt,req.params.date)){
      console.log("check")
      res.status(400).send({'error':`There is no milk at this date ${req.params.date}`});
    }
    console.log(milk)
    res.status(200).send({'capacity':milk.quantityRemaining});
  } catch (error) {
    res.status(400).send();
  }
})

router.post("/add", async (req, res) => {
  
  try {
    const milk = new Milk({
      ...req.body
    });
    milk.quantityRemaining=req.body.quantity;
    await milk.save();
    res.status(201).send(milk);
  } catch (e) {
    res.status(400).send(e);
  }
});


module.exports=router