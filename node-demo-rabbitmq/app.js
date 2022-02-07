require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const app = express()

const connection = mongoose.connect('mongodb://localhost:27017/rabbitmq');
if(!connection){
    console.log('connection not established')
}

app.use(express.json({ limit: "50mb" }));
app.use('/api/v1/u', require('./routing/user'))

app.get('/' , (req,res)=>{
    res.json({message : 'Home page'})
})

app.listen(process.env.PORT , ()=>{
    console.log(`Magical port ${process.env.PORT}`)
})