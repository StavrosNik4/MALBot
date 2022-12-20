const {Client, GatewayIntentBits} = require('Discord.js')
require('dotenv/config')
const g = require('./users.js')
const malScraper = require('mal-scraper')
const QuickChart = require('quickchart-js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log('ready')
})

client.on('messageCreate', msg => {

    const cm = msg.content
    const result = cm.trim().split(/\s+/);
    let rpm = ''
    let cs = ''
    //console.log(result);
    for (let i = 1; i < result.length; i++) {
        cs = cs + result[i] + ' '
    }
    //console.log(cs)

    if (result[0] === 'getUser')
        getUser(cs, msg, rpm);
    if (result[0] === 'getPictures')
        getPictures(cs, msg, rpm);
    if(result[0] === 'getStats')
        getStats(cs, msg, rpm);

})

function getUser(cs, msg, rpm){
    g.getUser(cs).then((data) => {
        //rpm = rpm + '```\n'
        for(var prop in data)
            rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n'
        //rpm = rpm + '```'
        msg.channel.send(rpm)
    })
}

function getPictures(cs, msg, rpm){
    malScraper.getPictures(cs).then((data) => {
        const finalObj = {}
        for(var prop1 in data){
            Object.assign(finalObj, data[prop1])
            for(var prop2 in finalObj) {
                rpm = rpm + prop2 + ': ' + finalObj[prop2] + '\n'
            }
        }
        msg.channel.send(rpm)
    }).catch((err) => console.log(err))
}

function getStats(cs, msg, rpm){
    malScraper.getStats(cs).then(async (data) => {
        let states = []
        for (var prop in data)
            states.push(data[prop])
        const chart = new QuickChart();
        chart.setConfig({
            type: 'bar',
            data: { labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'PTW'],
                datasets: [{ label: 'User State', data: [states[0], states[1], states[2], states[3], states[4] ] }] },
        });
        let url = await chart.getShortUrl();
        msg.channel.send(`User States: ${url}`);
        chart.setConfig({
            type: 'bar',
            data: { labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{ label: 'User Rating', data: [states[15], states[14], states[13], states[12], states[11],
                        states[10], states[9], states[8], states[7], states[6] ] }] },
        });
        url = await chart.getShortUrl();
        msg.channel.send(`User Rating: ${url}`);
    }).catch((err) => console.log(err))
}

client.login(process.env.TOKEN)