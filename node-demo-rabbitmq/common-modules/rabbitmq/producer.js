require('dotenv').config()
let amqp = require('amqplib')
let connection = null
let channel = null



if(!process.env.PROJECT)
{
    console.log('Project name not given')
}

if(!process.env.RABBIT_URL)
{
    console.log('Url not given')
}

// let queueName1 = process.env.PROJECT + '_Func'
let queueName1 = process.env.PROJECT + '_email'


async function startConnection() {
    try {
         connection = await amqp.connect(process.env.RABBIT_URL)
         channel = await connection.createChannel()
        await channel.assertQueue(queueName1, {
            durable: true
        })
        return channel
    } catch (e) {
        console.log(e)
    }
}

(async()=>{
    await startConnection();
    console.log('Producer connection has started')
//     let obj = { first: 2, second: 3, third: 5, type: 'add' };
//    sendMessageMatchResult(obj)
})()


function sendMessageMatchResult(data) {
    try{
        let a  = 
         channel.sendToQueue(queueName1, Buffer.from(JSON.stringify(data)), {
            persistent: true
        })
        console.log("JOB SENT SUCCESSFULLY" , JSON.stringify(a))
    }
    catch(e){
        console.log(e)
    }
}

module.exports = {
    sendMessageMatchResult
}