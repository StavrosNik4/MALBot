/**
 * Remove all non-alphanumeric characters from the string
 * @param str the given string
 * @returns {*} the given string without non-alphanumeric characters
 */
function removeNonAlphanumeric(str) {
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = {
    removeNonAlphanumeric
}