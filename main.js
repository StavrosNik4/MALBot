const Discord = require("discord.js")
const client = new Discord.Client()
const malScraper = require('mal-scraper')
const axios = require('axios')
const cheerio = require('cheerio')

const BASE_URI = 'https://myanimelist.net/profile/'

const parsePage = ($, name) => {
    const pfp = $('#content .user-image img')
    const status1 = $('#content .user-profile .user-status-title')
    const status2 = $('#content .user-profile .user-status-data')
    const result = []
    result.push({ Username: name })
    pfp.each(function () {
        result.push({
            ProfilePictureLink: $(this).attr('data-src').trim()
        })
    })
    result.push({
        LastOnline: $(status2[0]).text()
    })
    let i = 1
    const arrayLength = status1.length
    while (i < arrayLength - 1) {
        const val = $(status1[i]).text()
        switch (val) {
            case 'Gender':
                result.push({
                    Gender: $(status2[i]).text()
                })
                break
            case 'Birthday':
                result.push({
                    Birthday: $(status2[i]).text()
                })
                break
            case 'Location':
                result.push({
                    Location: $(status2[i]).text()
                })
                break
            case 'Joined':
                result.push({
                    Joined: $(status2[i]).text()
                })
        }
        i++
    }
    const finalObj = {}
    for (let i = 0; i < result.length; i++) {
        Object.assign(finalObj, result[i])
    }
    return finalObj
}

const searchPage = (url, name) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(({ data }) => {
                const $ = cheerio.load(data)
                const res = parsePage($, name)
                resolve(res)
            })
            .catch(/* istanbul ignore next */(err) => reject(err))
    })
}

const getUserFromName = (name) => {
    return new Promise((resolve, reject) => {
        searchPage(`${BASE_URI}${name}`, name)
            .then((data) => resolve(data))
            .catch(/* istanbul ignore next */(err) => reject(err))
    })
}

const getUser = (name) => {
    return new Promise((resolve, reject) => {
        if (!name || typeof name !== 'string') {
            reject(new Error('[Mal-Scraper]: Malformed input. ID or name is malformed or missing.'))
            return
        }

        getUserFromName(name)
            .then((data) => resolve(data))
            .catch(/* istanbul ignore next */(err) => reject(err))
    })
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
    const cm = msg.content
    const result = cm.trim().split(/\s+/);
    let rpm = ''
    var cs = ''
    cs = cs + result[1]
    if (result[0] === 'getUser') {

        rpm = ""
        getUser(cs).then((data) => {
            for(var prop in data)
                rpm = rpm + prop + ': ' + data[prop] + '\n'
            msg.reply(rpm)
        })

    }
    if (result[0] === 'getPictures') {
        const finalObj = {}
        malScraper.getPictures(cs).then((data) => {
            const finalObj = {}
            for(var prop1 in data){
                Object.assign(finalObj, data[prop1])
                for(var prop2 in finalObj) {
                    rpm = rpm + prop2 + ': ' + finalObj[prop2] + '\n'
                }
            }
            msg.reply(rpm)
            }).catch((err) => console.log(err))
    }
})

client.login()