const malScraper = require("mal-scraper");

/**
 * Function that returns information about a MyAnimeList (MAL) user.
 *
 * @param query {string} The username of the user.
 * @returns {Promise<string>} A Promise that resolves to a string with user information or an error message.
 */
function getUser(query) {
    return new Promise((resolve) => {
        let resultString = ""; // Initialize the result message

        // Step 1: Fetch user information from MyAnimeList
        malScraper.getUser(query)
            .then((data) => {
                try {
                    // Step 2: Build the result string with user information
                    for (let property in data)
                        resultString = resultString + '**' + property + ':**' + '\t' + data[property] + '\n';

                    // Step 3: Check if there is any user information
                    if (resultString !== "")
                        resolve(resultString); // Resolve the Promise with the resultString
                    else
                        resolve("User doesn't exist!"); // No user found
                } catch (err) {
                    // Step 4: Handle exceptions (user not found or other errors)
                    resolve("User doesn't exist!"); // User not found
                }
            })
            .catch(() => {
                // Step 4: Handle errors (e.g., network issues)
                resolve("Error!\nTry again!");
            });
    });
}

// Export the getUser function
module.exports = {
    getUser
}
