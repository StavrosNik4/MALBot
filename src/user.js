// function that returns info about a user
const malScraper = require("mal-scraper");

function getUser(query) {
    return new Promise((resolve) => {
        let rpm = "";   // result message
        malScraper.getUser(query)
            .then((data) => {
                try{
                    for (let prop in data)
                        rpm = rpm + '**' + prop + ':**' + '\t' + data[prop] + '\n';
                    if (rpm !== "")
                        resolve(rpm); // Resolve the Promise with the updated value of rpm
                    else
                        resolve("User doesn't exist!");
                }
                catch (err){
                    resolve("User doesn't exist!");
                }
            }).catch(() => {
            resolve("Error!\nTry again!")
        });
    });
}

module.exports = {
    getUser
}