/**
 * Returns the help message with information about every command of the bot.
 * @returns {string} the message to be sent
 */
function printHelp() {
    return  '>>> Commands\n' +
        '**>user** username: sends info for the user\n' +
        '**>stats** anime_name: sends stats in diagrams for an anime\n' +
        '**>pics** anime_name: sends pictures of an anime\n' +
        '**>info** anime_name: sends information for an anime\n' +
        '**>supp**: a command that show you all the ways you can support the MALBot project'
}

/**
 * Returns the support message with information about how to support this project.
 * @returns {string} the message to be sent
 */
function printSupport(){
    return  'You can support the MALBot Project by the following ways: \n' +
        ':star: Star the project on GitHub or help by contributing: https://github.com/StavrosNik4/MALBot \n' +
        ':arrow_forward: Watch YouTube video for the bot (it\'s in Greek but there are English subtitles available): \n' +
        ':moneybag: PayPal donate link: https://www.paypal.com/donate/?hosted_button_id=63 \n' +
        ':coffee: Buy me a Ko-fi: https://ko-fi.com/kamenos\n' +
        ':star: Add the bot to your own Discord server: https://discord.com/api/oauth2/authorize?client_id=1039731156125503560&permissions=8&scope=bot%20applications.commands\n' +
        'Thank you for all your support! :heart:'

}

module.exports = {
    printSupport,
    printHelp
}