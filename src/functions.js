function removeNonAlphanumeric(str) {
    // Remove all non-alphanumeric characters from the string
    return str.replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = {
    removeNonAlphanumeric
}