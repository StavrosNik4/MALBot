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
    //let rpm = ''
    let cs = ''
    //console.log(result);
    for (let i = 1; i < result.length; i++) {
        cs = cs + result[i] + ' '
    }
    //console.log(cs)

    if (result[0] === '>user')
        getUser(cs, msg);
    if (result[0] === '>pics')
        getPictures(cs, msg);
    if(result[0] === '>stats')
        getStats(cs, msg);
    if(result[0] === '>info')
        getInfo(cs, msg);

    if(result[0] === '>supp')
        printSupport(msg);
    if(result[0] === '>help')
        printHelp(msg);
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

function getStats(cs, msg){
    malScraper.getStats(cs).then(async (data) => {
        let states = []
        for (var prop in data)
            states.push(data[prop])
        const chart = new QuickChart();
        chart.setConfig({
            type: 'bar',
            data: {
                labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'PTW'],
                datasets: [{
                    label: 'User State',
                    data: [states[0], states[1], states[2], states[3], states[4]],
                    backgroundColor: '#4effdf'
                }]
            },
            options: {
                plugins: {
                    datalabels: {
                        color: '#fff'
                    }
                }
            }
        });
        let url = await chart.getShortUrl();
        msg.channel.send(`User States: ${url}`);
        chart.setConfig({
            type: 'bar',
            data: { labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                    datasets: [{ label: 'User Rating', data: [states[15], states[14], states[13], states[12], states[11],
                                                                states[10], states[9], states[8], states[7], states[6] ] }]
            },
            options: {
                plugins: {
                    datalabels: {
                        color: '#fff'
                    }
                }
            }
        });
        url = await chart.getShortUrl();
        msg.channel.send(`User Rating: ${url}`);
    }).catch((err) => console.log(err))
}

function getInfo(cs, msg, rpm){
    malScraper.getInfoFromName(cs).then((data) => {
        //rpm = rpm + '```\n'
        for(var prop in data) {
            if(prop !== 'characters' && prop !== 'staff')
                rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n'
        }
        //rpm = rpm + '```'
        msg.channel.send(rpm)
    })
}

function printHelp(msg) {
    const txt = '>>> Commands\n' +
                '**>user** username: sends info for the user\n' +
                '**>stats** anime_name: sends stats in diagrams for an anime\n' +
                '**>pics** anime_name: sends pictures of an anime\n' +
                '**>info** anime_name: sends information for an anime\n' +
                '**>supp**: a command that show you all the ways you can support the MALBot project'

    msg.channel.send(txt);

}

function printSupport(msg){
    const txt = '`You can support the MALBot Project by the following ways:` \n' +
                ':star: Star the project on GitHub or help by contributing: https://github.com/StavrosNik4/MALBot \n' +
                ':arrow_forward: Watch YouTube video for the bot (it\'s in Greek but there are English subtitles available): \n' +
                ':moneybag: PayPal donate link: https://www.paypal.com/donate/?hosted_button_id=63 \n' +
                ':coffee: or buy a Ko-fi: https://ko-fi.com/kamenos\n' +
                ':star: Add the bot to your own Discord server: https://discord.com/api/oauth2/authorize?client_id=1039731156125503560&permissions=8&scope=bot%20applications.commands\n' +
                'Thank you for all your support! :heart:'

    msg.channel.send(txt);
}

client.login(process.env.TOKEN)