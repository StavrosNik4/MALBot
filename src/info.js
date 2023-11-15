const malScraper = require("mal-scraper");

/**
 * Wrapper function that returns information for a series.
 *
 * @param query {string} Could be the MAL URL or the name of the anime.
 * @returns {Promise<{resultString: string, synopsis: string}|string>} A Promise that resolves to an object containing resultString and synopsis, or an error message.
 */
function getInfo(query) {
    return new Promise((resolve) => {
        let resultString = "";
        let synopsis = "";

        if (query.startsWith("http")) { // Case with MAL URL
            malScraper.getInfoFromURL(query)
                .then((data) => {
                    for (let property in data) {
                        if (property !== 'characters' && property !== 'staff')
                            resultString = resultString + '**' + property + ':**' + '\t' + data[property] + '\n';
                        else if (property === 'synopsis')
                            synopsis = synopsis + '**' + property + ':**' + '\t' + data[property] + '\n';
                    }
                    if (resultString !== "" && synopsis !== "")
                        resolve({ resultString, synopsis });
                    else
                        resolve("Series doesn't exist!");
                })
                .catch((err) => {
                    resolve("Error!\nTry again!");
                });
        } else { // Case with anime name
            malScraper.getInfoFromName(query, true)
                .then((data) => {
                    for (let property in data) {
                        if (property !== 'characters' && property !== 'staff' && property !== 'synopsis') {
                            resultString = resultString + '**' + property + ':**' + '\t' + data[property] + '\n';
                        } else if (property === 'synopsis') {
                            synopsis = synopsis + '**' + property + ':**' + '\t' + data[property] + '\n';
                        }
                    }
                    if (resultString !== "" && synopsis !== "") {
                        resolve({ resultString, synopsis });
                    } else {
                        resolve("Series doesn't exist!");
                    }
                })
                .catch((err) => {
                    resolve("Error!\nTry again!");
                });
        }
    });
}

module.exports = {
    getInfo
};
