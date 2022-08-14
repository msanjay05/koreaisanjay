const express = require("express");
require("./db/mongoose");
const orderRouter=require("./router/orderRouter")
const milkRouter=require("./router/milkRouter")
const userRouter=require("./router/userRouter")




const app = express();

app.use(express.json());
app.use("/api/order/",orderRouter);
app.use("/api/milk/",milkRouter);
app.use("/api/user/",userRouter);

module.exports=app;