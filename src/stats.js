// function that returns stats of a show in a visual way
const malScraper = require("mal-scraper");
const QuickChart = require("quickchart-js");
const {logger} = require("./functions");
const {removeNonAlphanumeric} = require("./functions");

function getStats(query){

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
                            malScraper.getStats({
                                name: highestTotalAnime.name.toString(),
                                id: parseInt(highestTotalAnime.id)
                            }).then(async (data) => {
                                let states = []
                                for (let prop in data)
                                    states.push(data[prop])
                                const chart = new QuickChart();
                                chart.setConfig({
                                    type: 'bar',
                                    data: {
                                        labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'PTW'],
                                        datasets: [{
                                            label: 'User State',
                                            data: [states[0], states[1], states[2], states[3], states[4]],
                                            backgroundColor: '#fd5b75',
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }]
                                    },
                                    options: {
                                        plugins: {
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }
                                    }
                                });
                                let url = await chart.getShortUrl();
                                let tmp = `User States: ${url}\n`;
                                chart.setConfig({
                                    type: 'bar',
                                    data: { labels: ['1-2', '3-4', '5-6', '7-8', '9-10'],
                                        datasets: [{
                                            label: 'User Rating',
                                            data: [states[15] + states[14], states[13] + states[12], states[11] +
                                            states[10], states[9] + states[8], states[7] + states[6] ],
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        },
                                        ]
                                    },
                                    options: {
                                        plugins: {
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }
                                    }
                                });
                                url = await chart.getShortUrl();
                                resolve(tmp + `User Rating: ${url}`);
                            }).catch((err) => {
                                logger.error(`getStats invalid input: ${query}`);
                                resolve({rpm: "Error!", rpm2: "Try again!"})
                            });
                        }
                        catch (e){
                            malScraper.getStats(query).then(async (data) => {
                                let states = []
                                for (let prop in data)
                                    states.push(data[prop])
                                const chart = new QuickChart();
                                chart.setConfig({
                                    type: 'bar',
                                    data: {
                                        labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'PTW'],
                                        datasets: [{
                                            label: 'User State',
                                            data: [states[0], states[1], states[2], states[3], states[4]],
                                            backgroundColor: '#fd5b75',
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }]
                                    },
                                    options: {
                                        plugins: {
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }
                                    }
                                });
                                let url = await chart.getShortUrl();
                                let tmp = `User States: ${url}\n`;
                                chart.setConfig({
                                    type: 'bar',
                                    data: { labels: ['1-2', '3-4', '5-6', '7-8', '9-10'],
                                        datasets: [{
                                            label: 'User Rating',
                                            data: [states[15] + states[14], states[13] + states[12], states[11] +
                                            states[10], states[9] + states[8], states[7] + states[6] ],
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }]
                                    },
                                    options: {
                                        plugins: {
                                            datalabels: {
                                                color: '#000000',
                                                yAdjust: 25
                                            }
                                        }
                                    }
                                });
                                url = await chart.getShortUrl();
                                resolve(tmp + `User Rating: ${url}`);
                            }).catch((err) => {
                                logger.error(`getStats invalid input: ${query}`);
                                resolve("Error!\nTry again!");
                            });
                        }
                    })
                    .catch((err) => {
                        logger.error(`getStats invalid input: ${query}`);
                        resolve("Error!\nTry again!");
                    });
            })
            .catch((err) => {
                logger.error(`getStats invalid input: ${query}`);
                resolve("Error!\nTry again!")
            });
    });
}

module.exports = {
    getStats
}