const {Client, GatewayIntentBits} = require('discord.js')
require('dotenv/config')
const sh = require('./SuppHelp.js');
const {getUser} = require('./user.js');
const {getStats} = require('./stats.js');
const {getPictures} = require('./pictures.js');
const {getInfo} = require('./info.js');


// create the client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// check that it's ready
client.on('ready', () => {
    console.log('Ready!')
})

// how the bot reacts to messages
client.on('messageCreate', msg => {

    // getting the message content
    const result = msg.content.trim().split(/\s+/);
    let query = ''
    for (let i = 1; i < result.length; i++) {
        // had a problem with space in the end of queries
        if(i!==result.length-1)
            query = query + result[i] + ' '
        else
            query = query + result[i]
    }

    // different commands
    if(result[0] === '>supp')
        msg.reply(sh.printSupport()).then(r => console.log(r)).catch((e) => console.log(e));
    if(result[0] === '>help')
        msg.reply(sh.printHelp()).then(r => console.log(r)).catch((e) => console.log(e));
    if (result[0] === '>user'){
        getUser(query).then((data) => {
                msg.reply(data.toString()) // sending the message
        }).catch((err) => console.log(err));
    }
    if (result[0] === '>pics') {
        getPictures(query).then((data) => {
                msg.reply(data.toString()) // sending the message
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>stats') {
        getStats(query).then((data) => {
                msg.reply(data.toString()) // sending the message
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>info'){
        getInfo(query).then((data) => {
            if (Object.keys(data).length === 2) {
                msg.reply(data.rpm); // sending the message
                msg.reply(data.synopsis); // sending the synopsis
            }
            else{
                msg.reply(data.toString()); // sending the message
            }
        }).catch((err) => console.log(err));
    }
})

// login
client.login(process.env.TOKEN).then(r => console.log(r)).catch((e) => console.log(e))