const {Client, GatewayIntentBits} = require('Discord.js')
require('dotenv/config')
require('./SuppHelp.js')
import {getUser, getStats, getInfo, getPictures} from "./functions.js";

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
    console.log('ready')
})

// how the bot reacts to messages
client.on('messageCreate', msg => {

    // getting the message content
    const result = msg.content.trim().split(/\s+/);
    let cs = ''
    for (let i = 1; i < result.length; i++) {
        cs = cs + result[i] + ' '
    }

    // different commands
    if(result[0] === '>supp')
        msg.channel.send(printSupport());
    if(result[0] === '>help')
        msg.channel.send(printHelp());
    if (result[0] === '>user'){
        getUser(cs).then((rpm) => {
                msg.channel.send(rpm);
        }).catch((err) => console.log(err));
    }
    if (result[0] === '>pics') {
        getPictures(cs).then((rpm) => {
            msg.channel.send(rpm);
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>stats') {
        getStats(cs).then((rpm) => {
            msg.channel.send(rpm);
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>info'){
        getInfo(cs).then((rpm) => {
            msg.channel.send(rpm);
        }).catch((err) => console.log(err));
    }


})

// login
client.login(process.env.TOKEN).then(r => console.log("Ready!"))