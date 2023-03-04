// function that returns pictures of a show
const malScraper = require("mal-scraper");
const {logger} = require("./functions");
const {removeNonAlphanumeric} = require("./functions");

function getPictures(query) {
    return new Promise((resolve) => {

        malScraper.getResultsFromSearch(query)
            .then((data) => {
                // Filter the search results to only include anime whose name contains the query
                const filteredData = data.filter((anime) => {
                    const animeName = removeNonAlphanumeric(anime.name.toLowerCase());
                    const queryStr = removeNonAlphanumeric(query.toLowerCase());
                    return animeName.includes(queryStr);
                });

                const promises = filteredData.map((anime) => {
                    return malScraper.getStats({
                        name: anime.name,
                        id: anime.id
                    }).then((stats) => {
                        anime.total = stats.total;
                        return anime;
                    }).catch((err) => {
                        logger.error(`Failed to get stats for ${anime.name}`);
                        console.log(`Failed to get stats for ${anime.name}: ${err}`);
                        anime.total = -1;
                        return anime;
                    });
                });

                Promise.all(promises)
                    .then((animeData) => {
                        const sortedData = animeData.sort((a, b) => b.total - a.total);
                        const highestTotalAnime = sortedData[0];
                        try{
                            malScraper.getPictures({
                                name: highestTotalAnime.name.toString(),
                                id: parseInt(highestTotalAnime.id)
                            })
                                .then((data) => {
                                    let rpm = "";
                                    const finalObj = {}
                                    for(let prop1 in data){
                                        Object.assign(finalObj, data[prop1])
                                        for(let prop2 in finalObj) {
                                            rpm = rpm + prop2 + ': ' + finalObj[prop2] + '\n'
                                        }
                                    }
                                    if (rpm !== "")
                                        resolve(rpm); // Resolve the Promise with the updated value of rpm
                                    else
                                        resolve("This series doesn't exists!");
                                })
                                .catch((err) => {
                                    logger.error(`getPictures invalid input: ${query}`);
                                    resolve({rpm: "Error!", rpm2: "Try again!"});
                                })
                        }
                        catch (err) {
                            malScraper.getPictures(query)
                                .then((data) => {
                                    let rpm = "";
                                    const finalObj = {}
                                    for(let prop1 in data){
                                        Object.assign(finalObj, data[prop1])
                                        for(let prop2 in finalObj) {
                                            rpm = rpm + prop2 + ': ' + finalObj[prop2] + '\n'
                                        }
                                    }
                                    if (rpm !== "")
                                        resolve(rpm); // Resolve the Promise with the updated value of rpm
                                    else
                                        resolve("This series doesn't exists!");
                                })
                                .catch((err) => {
                                    logger.error(`getPictures invalid input: ${query}`);
                                    resolve("Error!\nTry again!");
                                });
                        }
                    })
                    .catch((err) => {
                        logger.error(`getPictures invalid input: ${query}`);
                        resolve("Error!\nTry again!")
                    });
            })
            .catch((err) => {
                logger.error(`getPictures invalid input: ${query}`);
                resolve("Error!\nTry again!")
            });
    });
}

module.exports = {
    getPictures
}