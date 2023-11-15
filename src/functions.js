const fs = require("fs");

/**
 * Removes all non-alphanumeric characters from a given string.
 *
 * @param {string} str - The input string from which non-alphanumeric characters will be removed.
 * @returns {string} - The input string without non-alphanumeric characters.
 * @example
 * const cleanString = removeNonAlphanumeric("Hello! How are you? 123");
 * console.log(cleanString); // Output: "HelloHowareyou123"
 */
function removeNonAlphanumeric(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Logs and increments the count of a specific command in a file.
 *
 * @param {string} command - The command to be logged and incremented.
 * @example
 * logCommandEvent("run");
 * // If "run" is found in the file, it will be incremented. Otherwise, an error will be logged.
 */
function logCommandEvent(command) {
    const filePath = `./commands.txt`;

    // Read the file content
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading the file: ${err}`);
            return;
        }

        // Create a map to store the values for each command
        const valueMap = new Map();

        // Split the file content by lines and parse each line
        data.split('\n').forEach((line) => {
            const [key, value] = line.trim().split(':');
            if (key && value) {
                valueMap.set(key.trim(), parseInt(value.trim()));
            }
        });

        // Increment the value for the specified command
        if (valueMap.has(command)) {
            valueMap.set(command, valueMap.get(command) + 1);

            // Generate the updated content
            const updatedContent = Array.from(valueMap)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');

            // Write the updated content back to the file
            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing to the file: ${err}`);
                    return;
                }
                console.log(`${command} incremented successfully!`);
            });
        } else {
            console.error(`Command "${command}" not found in the file.`);
        }
    });
}

// Function to get the current timestamp in a human-readable format
function getCurrentTimestamp() {
    const now = new Date();
    // Format the date as 'YYYY-MM-DD'
    const formattedDate = now.toLocaleDateString('en-US');
    // Format the time as 'HH:MM:SS' in 24-hour format
    const formattedTime = now.toLocaleTimeString('en-US', { hour12: false });
    // Combine the date and time for the full timestamp
    return `${formattedDate} at ${formattedTime}`;
}

// Function to log a server event to a file
function logServerEvent(eventType, guild) {
    // Define the log file path based on the event type (joined or left)
    const logFilePath = `./${eventType}_servers.txt`;
    // Get the current timestamp
    const timestamp = getCurrentTimestamp();

    // Append the event information to the log file
    fs.appendFile(logFilePath, `${timestamp} - ${guild.name} (ID: ${guild.id})\n`, (err) => {
        if (err) {
            // Handle any errors that occur during file writing
            console.error('Error writing to log file:', err);
        }
    });
}

module.exports = {
    removeNonAlphanumeric,
    logCommandEvent,
    logServerEvent
}