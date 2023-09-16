const malScraper = require("mal-scraper");

/**
 * wrapper function that returns info for a series
 * @param query {string} Could be the MAL URL or the name of the anime
 * @returns {Promise<unknown>}
 */
function getInfo(query){
    return new Promise((resolve) => {
        let resultString = "";
        let synopsis = "";
        if (query.startsWith("http")) {     // case with MAL URL
            malScraper.getInfoFromURL(query).then((data) => {
                for (let property in data) {
                    // making the result string and the synopsis that will be sent in 2 different messages
                    if (property !== 'characters' && property !== 'staff')
                        resultString = resultString + '**' + property + ':**' + '\t' + data[property] + '\n';
                    else if(property ==='synopsis')
                        synopsis = synopsis + '**' + property + ':**' + '\t' + data[property] + '\n';
                }
                let resultPromise;
                if (resultString !== "" && synopsis !== "") {
                    resultPromise = {resultString, synopsis};
                    resolve(resultPromise); // Resolve the Promise with the updated value of rpm
                } else
                    resolve("Series doesn't exist!");
            }).catch((err) => {
                resolve("Error!\nTry again!");
            })
        }
        else
        {   // case with anime name
            malScraper.getInfoFromName(query, true).then((data) => {
                for (let property in data) {
                    // making the result string and the synopsis that will be sent in 2 different messages
                    if (property !== 'characters' && property !== 'staff' && property !== 'synopsis')
                        resultString = resultString + '**' + property + ':**' + '\t' + data[property] + '\n';
                    else if(property ==='synopsis')
                        synopsis = synopsis + '**' + property + ':**' + '\t' + data[property] + '\n';
                }
                let resultPromise;
                if (resultString !== "" && synopsis !== "") {
                    resultPromise = {resultString, synopsis};
                    resolve(resultPromise); // Resolve the Promise with the updated value of rpm
                } else
                    resolve("Series doesn't exist!");
            }).catch((err) => {
                resolve("Error!\nTry again!");
            })
        }
    });
}

module.exports = {
    getInfo
}