# MALBot
MALBot is a powerful Javascript Discord bot that scrapes data
from the popular anime and manga database website MyAnimeList.net and presents it in a visually
appealing way for users.

With MALBot, users can quickly access information about their favorite
anime (and manga in later update), including summaries, ratings, 
pictures and general information.

Additionally, MALBot provides users with charts that display statistics
for their favorite anime.

The bot is easy to use and helps users stay up-to-date with their favorite anime and manga
while also providing valuable insights into the broader anime community.
MALBot is an essential tool for every anime-related discord server.

## Invite the official bot to your server
Invite Link: https://discord.com/api/oauth2/authorize?client_id=1039731156125503560&permissions=412317174848&scope=bot

## Commands

**>help**: <br>
Sends all the available commands and description <br>

**>user** _username_:

With MALBot, you can easily retrieve all available data for a user on MyAnimeList.net. 
Simply enter the user's name and MALBot will provide you with their favourite anime and manga, 
along with other details such as their profile information and watching/reading progress. <br>

**>stats** _anime_name_ or _anime_url_:

With MALBot, you can easily get stats for any anime you're interested in.
You can easily get stats in chart form for any anime you're interested in. 
Simply enter the name of the anime and MALBot will provide you with the best matching anime, 
along with a chart displaying its stats. If you want to look up a specific anime that wasn't 
found through the naming search, you can also use the anime's URL from MyAnimeList.net 
to retrieve its stats in chart form. <br>

**>pics** _anime_name_ or _anime_url_: 

Want to see some posters of your favorite anime? MALBot can help with that too. 
Simply enter the name of the anime you're interested in, and MALBot will provide you 
with the pictures (and their links) from MyAnimeList.net. 
If you're looking for a specific anime that wasn't found through the naming search, 
you can also use the anime's URL from MyAnimeList.net.

**>info** _anime_name_ or _anime_url_: 

MALBot can also provide you with general information about any anime you're interested in. 
Simply enter the name of the anime, and MALBot will provide you with a synopsis, 
genre information, and other details about the anime. 
Again, if you're looking for a specific anime that wasn't found through the naming search, 
you can use the anime's URL from MyAnimeList.net.

**>supp**: 
A command that show you all the ways you can support the MALBot project.

### Command Examples

#### **>help** <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/help.png"> <br>

#### **>user** _username_
Command: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/user_1.png"> <br>
Result: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/user_2.png"> <br>

#### **>stats** _anime_name_
Command: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/stats_1.png"> <br>
Result: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/stats_2.png"> <br>

<ins>Note</ins>: Alternative you can use the **URL** of the anime from MAL.

#### **>pics** _anime_name_
Command: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/pics_1.png"> <br>
Result: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/pics_2.png"> <br>

<ins>Note</ins>: Alternative you can use the anime's **URL** from MAL.

#### **>info** _anime_name_
Command: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/info_1.png"> <br>
Result: <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/info_2.png"> <br>
<img src="https://github.com/StavrosNik4/MALBot/blob/main/examples/info_3.png"> <br>

<ins>Note</ins>: Alternative you can use the anime's **URL** from MAL.

#### **>supp**


## Logging

MALBot provides logging for the requests quanty by producing daily reports. Here is an example:

It also provides logging for the errors by making an error.log file. Here is an example:

## Documentation

The official full documentation for both use and coding is available here.

## Contribute

If you have an idea for the bot simply open an **issue page**. <br>
If you have done some work open a **pull request** where we can discuss it
before we add it. <br>
Thank you for all contributions! :heart:

### How to set up for coding & contribution

#### Pre-requirements
1. [Discord.js](https://github.com/discordjs/discord.js)
2. [MalScrapper](https://github.com/Kylart/MalScraper) by Kylart
3. [quickchart-js](https://www.npmjs.com/package/quickchart-js)

You can install all the pre-requirements with these commands: <br>
```npm i discord.js --save``` <br>
```npm install mal-scraper --save``` <br>
```npm i quickchart-js --save``` <br>
```npm i winston --save```

#### Steps:
1. Fork the project
2. Make a discord bot application through the Discord Developers Portal
3. Change the TOKEN value with your token (in string format)
4. Make your commits
5. Open a pull request and explain what you did

## Support

If you want to support the project you can:
<li>Star the project on GitHub or help by contributing</li>
<li>Watch my YouTube video for the bot (it's in Greek but there are English subtitles available) </li>
<li>Donate through [PayPal](https://www.paypal.com/donate/?hosted_button_id=J57Q96HPSQCYU) </li>
<li>Buy me a [Ko-fi](https://ko-fi.com/kamenos) </li>
<li>[Add the bot to your own Discord server](https://discord.com/api/oauth2/authorize?client_id=1039731156125503560&permissions=412317174848&scope=bot)</li>
<br>
All money will be used for the bot's hosting. <br>
Thank you for all your support! :heart:
