const {Client, GatewayIntentBits} = require('discord.js')
require('dotenv/config')
const sh = require('./SuppHelp.js');
const {getUser} = require('./user.js');
const {getStats} = require('./stats.js');
const {getPictures} = require('./pictures.js');
const {getInfo} = require('./info.js');
const {logCommandEvent} = require('./functions.js');
const fs = require("fs");


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

// Event listener for when the bot joins a server (guild)
client.on('guildCreate', (guild) => {
    // Log the server join event to the console
    console.log(`Bot joined server: ${guild.name} (ID: ${guild.id})`);
    // Call the function to log the server join event to a file
    logServerEvent('joined', guild);
});

// Event listener for when the bot leaves a server (guild)
client.on('guildDelete', (guild) => {
    // Log the server leave event to the console
    console.log(`Bot left server: ${guild.name} (ID: ${guild.id})`);
    // Call the function to log the server leave event to a file
    logServerEvent('left', guild);
});

// Function to get the current timestamp in a human-readable format
function getCurrentTimestamp() {
    const now = new Date();
    // Format the date as 'YYYY-MM-DD'
    const formattedDate = now.toLocaleDateString('en-US');
    // Format the time as 'HH:MM:SS' in 24-hour format
    const formattedTime = now.toLocaleTimeString('en-US', { hour12: false });
    // Combine the date and time for the full timestamp
    return `${formattedDate} at ${formattedTime}`;
}

// Function to log a server event to a file
function logServerEvent(eventType, guild) {
    // Define the log file path based on the event type (joined or left)
    const logFilePath = `./${eventType}_servers.txt`;
    // Get the current timestamp
    const timestamp = getCurrentTimestamp();

    // Append the event information to the log file
    fs.appendFile(logFilePath, `${timestamp} - ${guild.name} (ID: ${guild.id})\n`, (err) => {
        if (err) {
            // Handle any errors that occur during file writing
            console.error('Error writing to log file:', err);
        }
    });
}

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
    if(result[0] === '>supp'){
        logCommandEvent('supp');
        msg.reply(sh.printSupport()).then(r => console.log(r)).catch((e) => console.log(e));
    }
    if(result[0] === '>help') {
        logCommandEvent('help');
        msg.reply(sh.printHelp()).then(r => console.log(r)).catch((e) => console.log(e));
    }
    if (result[0] === '>user'){
        logCommandEvent('user');
        getUser(query).then((data) => {
                msg.reply(data.toString()) // sending the message
        }).catch((err) => console.log(err));
    }
    if (result[0] === '>pics') {
        logCommandEvent('pics');
        getPictures(query).then((data) => {
                msg.reply(data.toString()) // sending the message
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>stats') {
        logCommandEvent('stats');
        getStats(query).then((data) => {
                msg.reply(data.toString()) // sending the message
        }).catch((err) => console.log(err));
    }
    if(result[0] === '>info'){
        logCommandEvent('info');
        getInfo(query).then((data) => {
            if (Object.keys(data).length === 2) {
                // sending 2 messages because the content is too big for one discord message
                msg.reply(data.resultString); // sending the message
                msg.reply(data.synopsis); // sending the synopsis
            }
            else{
                msg.reply(data.toString()); // sending the message
            }
        }).catch((err) => console.log(err));
    }
})

// login
client.login(process.env.DEV_TOKEN).then(r => console.log(r)).catch((e) => console.log(e))