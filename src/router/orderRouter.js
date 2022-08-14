const express = require("express");
const Order = require("../models/order");
const Milk = require("../models/milk");
const helper=require("../helper")
const currentStatus=require('../models/currentstatus');
const checkAuth = require("../middleware/checkAuth");

const router = new express.Router();



// create order

const updateMilkQuantity=async function(quantity,date){
  try {
    const milk=await Milk.findOne({createdAt : { $lte : date} });
    if(milk==null||helper.matchDate(milk.createdAt,date)){
      throw({'error':`No Milk found at this date ${date}`})
    }
    if(milk.quantityRemaining>=quantity){
      milk.quantityRemaining-=quantity;
    }else{
      throw ({'error':`only ${milk.quantityRemaining} litres of milk left, please order within the quantity`});
    }
    if(milk.quantityRemaining>milk.quantity){
      throw ({'error':'out of stock cannot be updated'})
    }
    await milk.save();
    return milk.pricePerLitre;
  } catch (error) {
    throw error;
  }
  
}

router.post("/add",checkAuth, async (req, res) => {
  
  try {
    const price=await updateMilkQuantity(req.body.quantity,new Date());
    const order = new Order({
      ...req.body,
      creator: req.userData.userId,
      totalPrice:price*req.body.quantity
    });
    order.trackStatus.push({'status':'placed'})
    await order.save();
    res.status(201).send(order);
  } catch (e) {
    res.status(400).send(e);
  }
});




router.patch("/update/:id",checkAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["quantity"];
  const isAllowed = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  
  try {
    if (!isAllowed) {
      throw ({ error: "You can only change the quantity of your order" });
    }
    const order = await Order.findOne({
      _id: req.params.id,
      creator: req.userData.userId
    });
    if (!order) {
      return res.status(400).send({ error:`Order with this id ${req.params.id} not found`});
    }
    const price=await updateMilkQuantity(req.body.quantity-order.quantity,order.createdAt);
    order.quantity = req.body.quantity;
    order.totalPrice=price*order.quantity;

    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send(e);
  }
});



router.patch("/updateStatus/:id",checkAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["currentStatus"];
  const isAllowed = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  
  try {
    if (!isAllowed) {
      throw ({ error: "You can only change the currentStatus of your order" });
    }
    const order = await Order.findOne({
      _id: req.params.id,
      creator: req.userData.userId,
    });
    if (!order) {
      return res.status(400).send({ error: "Id not found" });
    }
    if(!currentStatus[req.body.currentStatus]){
      throw ({ error: `Invalid status ${req.body.currentStatus}` });

    }
    if(currentStatus[req.body.currentStatus]<=currentStatus[order.currentStatus]){
      throw ({ error: `Order status cannot be changed back to ${req.body.currentStatus}` });
    }
    order.currentStatus=req.body.currentStatus;
    order.trackStatus.push({'status':order.currentStatus});
    await order.save();
    res.status(200).send(order);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/delete/:id",checkAuth, async (req, res) => {
  const _id = req.params.id;
  try {
    const order = await Order.findOne({ _id,creator: req.userData.userId});
    if (!order) {
      return res.status(400).send({ error: "Id not found" });
    }
    if(currentStatus[order.currentStatus]>=2){
      throw ({ error: `Order can't be deleted, already ${order.currentStatus}` });
      
    }
    await order.delete();
    await updateMilkQuantity(-order.quantity,order.createdAt);
    res.status(200).send({"message":`order with id ${req.params.id} deleted succesfully`});
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
