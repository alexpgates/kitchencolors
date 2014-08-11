Kitchencolors!
============

##### by @alexpgates

Kitchencolors is a project that allows the internet to decide the color of your <a href="http://meethue.com/">Philips Hue bulbs / LightStrips</a>.

The vast majority of this code was forked from outadoc's <a href="https://github.com/outadoc/twitter-mentions-pushover">twitter-mentions-pushover</a>. I stripped out the Pushover stuff and instead push requests to <a href="https://github.com/bahamas10/hue-cli">hue-cli</a>.

This is a very quick first pass and a little rough around the edges.

- Create a Twitter account and grab your API keys after creating your Application on dev.twitter.com
- Make sure Node.js is installed
- Grab <a href="https://www.npmjs.org/package/hue-cli">hue-cli</a> and get it configured and working from your command line
- edit the exec() command on line 58 of bot.js to set which lights you want to control. (You'll get this after you have hue-cli up and running).
- edit config.json with your twitter keys
- node bot.js, and give it a try!