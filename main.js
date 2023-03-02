const {Client, GatewayIntentBits} = require('Discord.js')
require('dotenv/config')
const sh = require('./SuppHelp.js');
const {getUser, getStats, getPictures, getInfo} = require('./functions.js');

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
    let query = ''
    for (let i = 1; i < result.length; i++) {
        if(i!==result.length-1)
            query = query + result[i] + ' '
        else
            query = query + result[i]
    }

    //console.log(query)

    // different commands
    if(result[0] === '>supp')
        msg.reply(sh.printSupport());
    if(result[0] === '>help')
        msg.reply(sh.printHelp());
    if (result[0] === '>user'){
        getUser(query).then((rpm) => {
                msg.reply(rpm); // sending the message
        }).catch((err) => console.log(err));
    }
    if (result[0] === '>pics') {
        getPictures(query).then((rpm) => {
                msg.reply(rpm); // sending the message
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>stats') {
        getStats(query).then((rpm) => {
                msg.reply(rpm); // sending the message
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>info'){
        getInfo(query).then((rpm) => {
            if (Object.keys(rpm).length === 2) {
                msg.reply(rpm.rpm); // sending the message
                msg.reply(rpm.synopsis); // sending the synopsis
            }
            else{
                msg.reply(rpm); // sending the message
            }
        }).catch((err) => console.log(err));
    }


})

// login
client.login(process.env.TOKEN).then(r => console.log("Ready!"))