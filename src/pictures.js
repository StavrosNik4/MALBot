const malScraper = require("mal-scraper");
const { removeNonAlphanumeric } = require("./functions.js");

/**
 * Function that returns pictures of an anime series.
 *
 * @param query {string} Could be the MAL URL or the name of the anime.
 * @returns {Promise<string>} A Promise that resolves to a string with anime pictures or an error message.
 */
async function getPictures(query) {
    try {
        // Step 1: Search for anime based on the query
        const data = await malScraper.getResultsFromSearch(query);

        // Step 2: Filter the search results to match the query
        const filteredData = data.filter((anime) => {
            const animeName = removeNonAlphanumeric(anime.name.toLowerCase());
            const queryStr = removeNonAlphanumeric(query.toLowerCase());
            return animeName.includes(queryStr);
        });

        // Step 3: Fetch statistics for each filtered anime
        const promises = filteredData.map(async (anime) => {
            try {
                const stats = await malScraper.getStats({ name: anime.name, id: anime.id });
                anime.total = stats.total;
                return anime;
            } catch (err) {
                console.log(`Failed to get stats for ${anime.name}: ${err}`);
                anime.total = -1;
                return anime;
            }
        });

        // Step 4: Wait for all promises to resolve
        const animeData = await Promise.all(promises);

        // Step 5: Find the most popular anime without sorting
        let mostPopularAnime = animeData.reduce((prev, current) => (current.total > prev.total) ? current : prev);

        // Step 6: Fetch pictures for the most popular anime
        const picturesData = await malScraper.getPictures({
            name: mostPopularAnime.name.toString(),
            id: parseInt(mostPopularAnime.id)
        });

        // Step 7: Build a result string with picture details
        let resultString = "";
        for (let property1 in picturesData) {
            const finalObj = Object.assign({}, picturesData[property1]);
            for (let property2 in finalObj) {
                resultString = resultString + property2 + ': ' + finalObj[property2] + '\n';
            }
        }

        // Step 8: Check if resultString is not empty and return the result
        if (resultString !== "") {
            return resultString;
        } else {
            return "This series doesn't exist!";
        }
    } catch (err) {
        // Step 9: Handle exceptions when fetching pictures
        console.error("Error!\nTry again!", err);
        return "Error!\nTry again!";
    }
}

module.exports = {
    getPictures
};
