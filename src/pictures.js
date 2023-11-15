const malScraper = require("mal-scraper");
const {removeNonAlphanumeric} = require("./functions.js");

/**
 * Function that returns pictures of an anime series.
 *
 * @param query {string} Could be the MAL URL or the name of the anime.
 * @returns {Promise<string>} A Promise that resolves to a string with anime pictures or an error message.
 */
function getPictures(query) {
    return new Promise((resolve) => {
        // Step 1: Search for anime based on the query
        malScraper.getResultsFromSearch(query)
            .then((data) => {
                // Step 2: Filter the search results to match the query
                const filteredData = data.filter((anime) => {
                    const animeName = removeNonAlphanumeric(anime.name.toLowerCase());
                    const queryStr = removeNonAlphanumeric(query.toLowerCase());
                    return animeName.includes(queryStr);
                });
                // Step 3: Fetch statistics for each filtered anime
                const promises = filteredData.map((anime) => {
                    return malScraper.getStats({
                        name: anime.name,
                        id: anime.id
                    }).then((stats) => {
                        anime.total = stats.total;
                        return anime;
                    }).catch((err) => {
                        console.log(`Failed to get stats for ${anime.name}: ${err}`);
                        anime.total = -1;
                        return anime;
                    });
                });

                // Step 4: Wait for all promises to resolve
                Promise.all(promises)
                    .then((animeData) => {
                        // Step 5: Find the most popular anime without sorting
                        let highestTotalAnime = animeData[0];

                        for (let i = 1; i < animeData.length; i++)
                            if (animeData[i].total > highestTotalAnime.total)
                                highestTotalAnime = animeData[i];

                        // Step 6: Fetch pictures for the most popular anime
                        try{
                            malScraper.getPictures({
                                name: highestTotalAnime.name.toString(),
                                id: parseInt(highestTotalAnime.id)
                            })
                                .then((data) => {
                                    // Step 7: Build a result string with picture details
                                    let resultString = "";
                                    const finalObj = {}
                                    for(let property1 in data){
                                        Object.assign(finalObj, data[property1])
                                        for(let property2 in finalObj) {
                                            resultString = resultString + property2 + ': ' + finalObj[property2] + '\n'
                                        }
                                    }
                                    if (resultString !== "")
                                        resolve(resultString); // Resolve the Promise with the result string
                                    else
                                        resolve("This series doesn't exists!");
                                })
                                .catch((err) => {
                                    resolve({resultString: "Error!", resultString2: "Try again!"});
                                })
                        }
                        catch (err) {
                            // Step 8: Handle exceptions when fetching pictures
                            malScraper.getPictures(query)
                                .then((data) => {
                                    // Step 9: Build a result string with picture details
                                    let resultString = "";
                                    const finalObj = {}
                                    for(let prop1 in data){
                                        Object.assign(finalObj, data[prop1])
                                        for(let prop2 in finalObj) {
                                            resultString = resultString + prop2 + ': ' + finalObj[prop2] + '\n'
                                        }
                                    }
                                    if (resultString !== "")
                                        resolve(resultString); // Resolve the Promise with the result string
                                    else
                                        resolve("This series doesn't exists!");
                                })
                                .catch((err) => {
                                    resolve("Error!\nTry again!");
                                });
                        }
                    })
                    .catch((err) => {
                        resolve("Error!\nTry again!")
                    });
            })
            .catch((err) => {
                resolve("Error!\nTry again!")
            });
    });
}

module.exports = {
    getPictures
}