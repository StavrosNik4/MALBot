// function that returns info about a user
const g = require("./users");
const {logger} = require("./functions");

function getUser(query) {
    return new Promise((resolve) => {
        let rpm = "";
        g.getUser(query)
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
                    logger.error(`getUser invalid input: ${query}`);
                    resolve("User doesn't exist!");
                }
            }).catch(() => {
            logger.error(`getUser invalid input: ${query}`);
            resolve("Error!\nTry again!")
        });
    });
}

module.exports = {
    getUser
}