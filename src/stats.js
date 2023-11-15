const malScraper = require("mal-scraper");
const QuickChart = require("quickchart-js");
const { removeNonAlphanumeric } = require("./functions");

/**
 * Function that returns stats of a show in a visual way.
 *
 * @param query {string} Could be the MAL URL or the name of the anime.
 * @returns {Promise<string>} A Promise that resolves to a string with charts representing user states and ratings or an error message.
 */
async function getStats(query) {
    try {
        // Step 1: Search for anime based on the query
        const data = await malScraper.getResultsFromSearch(query);

        // Step 2: Filter the search results to only include anime whose name contains the query
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
        const animeData = await Promise.all(promises);

        // Step 5: Find the most popular anime without sorting
        let mostPopularAnime = animeData.reduce((prev, current) => (current.total > prev.total) ? current : prev);

        // Step 6: Fetch statistics for the most popular anime
        const dataStats = await malScraper.getStats({
            name: mostPopularAnime.name.toString(),
            id: parseInt(mostPopularAnime.id)
        });

        // Step 7: Extract data for user states and ratings
        const states = [];
        for (let prop in dataStats) {
            states.push(dataStats[prop]);
        }

        // Step 8: Create a chart for user states
        const chartUserStates = createChart(['Watching', 'Completed', 'On Hold', 'Dropped', 'PTW'], [states[0], states[1], states[2], states[3], states[4]]);
        const urlUserStates = await chartUserStates.getShortUrl();

        // Step 9: Create a chart for user ratings
        const chartUserRating = createChart(['1-2', '3-4', '5-6', '7-8', '9-10'], [states[15] + states[14], states[13] + states[12], states[11] + states[10], states[9] + states[8], states[7] + states[6]]);
        const urlUserRating = await chartUserRating.getShortUrl();

        // Step 10: Build and return the result string with chart URLs
        return `User States: ${urlUserStates}\nUser Rating: ${urlUserRating}`;
    } catch (err) {
        console.error("Error!\nTry again!", err);
        return "Error!\nTry again!";
    }
}

/**
 * Helper function to create a QuickChart instance with specified data and options.
 *
 * @param labels {string[]} Labels for the chart.
 * @param data {number[]} Data values for the chart.
 * @returns {QuickChart} QuickChart instance.
 */
function createChart(labels, data) {
    const chart = new QuickChart();
    chart.setConfig({
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: data,
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
    return chart;
}

module.exports = {
    getStats
};
