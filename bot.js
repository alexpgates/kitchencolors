/* outa[bot] // app.js
        Copyright (c) 2012-2013 outa[dev].
*/

(function() {
        //the twitter api module
        var ntwitter    = require('ntwitter'),
                request         = require('request'),
                entities        = require('entities'),
                LogUtils        = require('./lib/LogUtils.js'),
                spawn           = require('child_process').spawn,

                //the username. not set to begin with, we'll get it when authenticating
                twitterUsername = null,

                //get the config (API keys, etc.)
                config = require('./config.json'),

                //create an object using the keys we just determined
                twitterAPI = new ntwitter(config.keys.twitter);

        //check if we have the rights to do anything
        twitterAPI.verifyCredentials(function(error, userdata) {
                if (error) {
                        //if we don't, we'd better stop here anyway
                        LogUtils.logtrace(error, LogUtils.Colors.RED);
                        process.exit(1);
                } else {
                        //the credentials check returns the username, so we can store it here
                        twitterUsername = userdata.screen_name;
                        LogUtils.logtrace("logged in as [" + userdata.screen_name + "]", LogUtils.Colors.CYAN);

                        //start listening to tweets that contain the bot's username using the streaming api
                        initStreaming();
                }
        });

        //this is called when streaming begins
        function streamCallback(stream) {
                LogUtils.logtrace("streaming", LogUtils.Colors.CYAN);

                //when we're receiving something
                stream.on('data', function(data) {
                        //if it's actually there
                        if(data.text !== undefined) {
                                //a few checks to see if we should reply
                                if(data.user.screen_name.toLowerCase() != twitterUsername.toLowerCase()                         //if it wasn't sent by the bot itself
                                        && data.text.toLowerCase().indexOf('@' + twitterUsername.toLowerCase()) != -1   //if it's really mentionning us (it should)
                                        && data.retweeted_status === undefined) {                                                                               //and if it isn't a retweet of one of our tweets

                                        LogUtils.logtrace("[" + data.id_str + "] @mention from [" + data.user.screen_name + "]", LogUtils.Colors.GREEN);

                                        var tweet_text = data.text;
                                        // remove any at mentions in the tweet
                                        var tweet_text = tweet_text.replace('#', '');
                                        tweet_text = tweet_text.replace('!', '');
                                        tweet_text = tweet_text.replace(/\B@([\w-]+)/gm, '').trim();

                                        // attempt to protect against attacks by whitelisting
                                        tweet_text = tweet_text.replace(/[^a-zA-Z0-9]/g, '');

                                        var args = ['lights', '5'],
                                            tweet_args = tweet.split(' ').filter(function (e) { return e.length > 0; });

                                        var hue = spawn('hue',  args.concat(tweet_args)); 

                                        hue.stdout.on('data', function (data) {
                                          console.log('stdout: ' + data);
                                        });

                                        hue.stderr.on('data', function (data) {
                                          console.log('stderr: ' + data);
                                        });

                                        hue.on('close', function (code) {
                                          console.log('hue result: ' + code);
                                        });

                                        console.log(tweet_text);
                                }
                        }
                });

                //if something happens, call the onStreamError function
                stream.on('end', onStreamError);
                stream.on('error', onStreamError);

                //automatically disconnect every 30 minutes (more or less) to reset the stream
                //setTimeout(stream.destroy, 1000 * 60 * 30);
        }

        function onStreamError(e) {
                //when the stream is disconnected, connect again
                if(!e.code) e.code = "unknown";
                LogUtils.logtrace("streaming ended (" + e.code + ")", LogUtils.Colors.RED);
                setTimeout(initStreaming, 5000);
        }

        function initStreaming() {
                //initialize the stream and everything else
                twitterAPI.stream('user', { with:'followings', track:'@' + twitterUsername }, streamCallback);
        }

})();
