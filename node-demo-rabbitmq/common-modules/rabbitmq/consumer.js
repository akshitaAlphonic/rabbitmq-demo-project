require('dotenv').config()
const amqp = require('amqplib')
const func = require('../emailfunc')
let connection = null
let channel = null
const mongoose = require('mongoose')
let User = require('../../models/user')
let Information = require('../../models/information')

const mongoConnection = mongoose.connect('mongodb://localhost:27017/rabbitmq');
if(!mongoConnection){
    console.log('connection not established')
}


if(!process.env.PROJECT)
{
    console.log('Project name not given')
}

if(!process.env.RABBIT_URL)
{
    console.log('Url not given')
}

let queueName = process.env.PROJECT + '_Func'



async function startConnection() {
    try {

         connection = await amqp.connect(process.env.RABBIT_URL)
         channel = await connection.createChannel()
        await channel.assertQueue(queueName, {
            durable: true
        })
        return channel
    } catch (e) {
        console.log(e)
    }
}
(async()=>{
    await startConnection();
    await consumeMessageResult()
    console.log('Consumer connection has started')
   
})()


async function consumeMessageResult() {
    try{
         channel.prefetch(1);
         channel.consume(queueName, async (msg) => {
          try {
            let userData = JSON.parse(msg.content.toString())
            let userCount =await User.countDocuments()
            await Information.updateOne({objectKey : 'userState'},{$set:{objectKey:'userState' ,dashboardStats:userCount}},
            {upsert: true})
            channel.ack(msg);
          } catch (error) {
            console.log(error);
          }
        });
    }
    catch(e){
        console.log(e)
    }
}
