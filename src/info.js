// function that returns info for a series
const malScraper = require("mal-scraper");
const {logger} = require("./functions");

function getInfo(query){
    return new Promise((resolve, reject) => {
        let rpm = "";
        let synopsis = "";
        if (query.startsWith("http")) {
            malScraper.getInfoFromURL(query).then((data) => {
                for (let prop in data) {
                    if (prop !== 'characters' && prop !== 'staff')
                        rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n'
                    else if(prop ==='synopsis')
                        synopsis = synopsis + '**' + prop + ':**' + '\t' + data[prop] + '\n'
                }
                let tmp;
                if (rpm !== "" && synopsis !== "") {
                    tmp = {rpm, synopsis};
                    resolve(tmp); // Resolve the Promise with the updated value of rpm
                } else
                    resolve("Series doesn't exist!");
            }).catch((err) => {
                resolve("Error!\nTry again!")
            })
        }
        else
        {
            malScraper.getInfoFromName(query, true).then((data) => {
                for (let prop in data) {
                    if (prop !== 'characters' && prop !== 'staff' && prop !== 'synopsis')
                        rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n'
                    else if(prop ==='synopsis')
                        synopsis = synopsis + '**' + prop + ':**' + '\t' + data[prop] + '\n'
                }
                let tmp;
                if (rpm !== "" && synopsis !== "") {
                    tmp = {rpm, synopsis};
                    resolve(tmp); // Resolve the Promise with the updated value of rpm
                } else
                    resolve("Series doesn't exist!");
            }).catch((err) => resolve("Error!\nTry again!"))
        }
    });
}

module.exports = {
    getInfo
}