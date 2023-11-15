const fs = require("fs");

/**
 * Remove all non-alphanumeric characters from the string
 * @param str the given string
 * @returns {*} the given string without non-alphanumeric characters
 */
function removeNonAlphanumeric(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

function logCommandEvent(command){
    const filePath = `./commands.txt`;
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


module.exports = {
    removeNonAlphanumeric,
    logCommandEvent
}