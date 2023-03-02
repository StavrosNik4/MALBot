const g = require("./users");
const malScraper = require("mal-scraper");
const QuickChart = require("quickchart-js");

function removeNonAlphanumeric(str) {
    // Remove all non-alphanumeric characters from the string
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

// function that returns info about a user
function getUser(query) {
    return new Promise((resolve, reject) => {
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
                catch (e){
                    resolve("User doesn't exist!");
                }
            }).catch((err) => resolve("Error!\nTry again!"));
    });
}

// function that returns pictures of a show
function getPictures(query) {
    return new Promise((resolve, reject) => {

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
                                .catch((err) => resolve({rpm: "Error!", rpm2: "Try again!"}))
                        }
                        catch (e){
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
                                .catch((err) => resolve("Error!\nTry again!"));
                        }
                    })
                    .catch((err) => resolve("Error!\nTry again!"));
            })
            .catch((err) => resolve("Error!\nTry again!"));
    });
}

// function that returns stats of a show in a visual way
function getStats(query){

    return new Promise((resolve, reject) => {

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
                            }).catch((err) => resolve({rpm: "Error!", rpm2: "Try again!"}));
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
                            }).catch((err) => resolve("Error!\nTry again!"));
                        }
                    })
                    .catch((err) => resolve("Error!\nTry again!"));
            })
            .catch((err) => resolve("Error!\nTry again!"));
    });
}

// function that returns info for a series
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
    getStats,
    getUser,
    getPictures,
    getInfo
}