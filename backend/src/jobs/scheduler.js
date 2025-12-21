const cron = require('node-cron');
const ScheduledMessage  = require('../models/ScheduledMessage');

cron.schedule('* * * * *',async ()=>{
    const now = new Date();
    const message = await ScheduledMessage.find({sendAt: {$lte: now}});
    for(let msg of message){
        console.log(`Sending message : `,msg.message);
        await ScheduledMessage.deleteOne({_id: msg._id});
    }
})