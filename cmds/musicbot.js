const botSettings = require("../resources/keys.json");
const ytdl = require("ytdl-core");
const request = require("request");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const ytlist = require('youtube-playlist');

const ytapikey = botSettings.yt_api_key;

module.exports.run = async (bot, message, args) => {

	args[0] = args.join(" ")

	if (!args[0] && bot.musicguilds[message.guild.id].isPlaying == true && bot.musicguilds[message.guild.id].isPaused) {
		bot.musicguilds[message.guild.id].dispatcher.resume();
		bot.musicguilds[message.guild.id].isPaused = !bot.musicguilds[message.guild.id].isPaused;
		let msg = await message.reply("Music has been resumed.");
		msg.delete({timeout: 14000});
		return;
	} else if(!args[0] && bot.musicguilds[message.guild.id].isPlaying == true) {
		return message.reply(" music is already playing.");
	} else if(!args[0] && bot.guildSettings[message.guild.id].queue.length > 0){
		bot.musicguilds[message.guild.id].voiceChannel = message.member.voice.channel;
		playMusic(bot.guildSettings[message.guild.id].queue[0].id, message)
		bot.musicguilds[message.guild.id].isPlaying = true;
		message.reply(` now Playing **${bot.guildSettings[message.guild.id].queue[0].name}**`);
		return;
	} else if(!args[0]){
		let msg = await message.reply("Nothing in queue, so please specify a search/video paramater.");
		msg.delete({timeout: 7000}).catch(err => console.log(err));
		return;
	} else if(message.member.voice.channel == null){
		let msg = await message.reply("You must be in a voice channel / Bot must be playing to use this command.");
		msg.delete({timeout: 7000}).catch(err => console.log(err));
		return;
	}

	bot.musicguilds[message.guild.id].voiceChannel = message.member.voice.channel;

	if (args[0].includes("list=")){
		let songlist = [];
		await ytlist(args[0], 'url').then(res => {
			res.data.playlist.forEach(s => songlist.push(getYouTubeID(s)));
		});
		for(i =0; i < songlist.length; i++){
			let id = songlist[i];
			await fetchVideoInfo(id, (err, videoInfo) => {
				if(err) throw new Error(err);
				console.log(id);
				if(bot.guildSettings[message.guild.id].queue.length > 0 || bot.musicguilds[message.guild.id].isPlaying){
				    bot.guildSettings[message.guild.id].queue.push({id: id, name: videoInfo.title});
				} else {
					playMusic(id, message);
					bot.musicguilds[message.guild.id].isPlaying = true;
				    bot.guildSettings[message.guild.id].queue.push({id: id, name: videoInfo.title});
				   	message.reply(` now Playing **${videoInfo.title}**\nhttps://www.youtube.com/watch?v=${id}`);
				}
			});
		};
		message.reply(" playlist added to queue. Type !q to view.");
	}
	else{
		getID(args[0], async id => {
			if(id == "novid"){
				let msg = await message.reply(`No videos found with search "${args[0]}".`);
			 	msg.delete({timeout: 7000}).catch(err => console.log(err));
			 	return;
			}
			fetchVideoInfo(id, (err, videoInfo) => {
				if(err) throw new Error(err);

				if(bot.guildSettings[message.guild.id].queue.length > 0 || bot.musicguilds[message.guild.id].isPlaying){
			    	if (isYoutube(id)) {
				        bot.guildSettings[message.guild.id].queue.push({id: getYouTubeID(id), name: videoInfo.title});
				    	message.reply(` added to queue **${videoInfo.title}**\nYou searched for: "${args[0]}"\nhttps://www.youtube.com/watch?v=${id}`);
				    } else {
				        bot.guildSettings[message.guild.id].queue.push({id: id, name: videoInfo.title});
				    	message.reply(` added to queue **${videoInfo.title}**\nhttps://www.youtube.com/watch?v=${id}`);
				    }
				}
				else {
					playMusic(id, message);
					bot.musicguilds[message.guild.id].isPlaying = true;
					if (isYoutube(id)) {
				        bot.guildSettings[message.guild.id].queue.push({id: getYouTubeID(id), name: videoInfo.title});
				    	message.reply(` now Playing **${videoInfo.title}**\nYou searched for: "${args[0]}"\nhttps://www.youtube.com/watch?v=${id}`);
				    } else {
				        bot.guildSettings[message.guild.id].queue.push({id: id, name: videoInfo.title});
				    	message.reply(` now Playing **${videoInfo.title}**\nhttps://www.youtube.com/watch?v=${id}`);
				    }
				}

			});
		});
	}

}

function search_video(query, callback){
	request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + ytapikey, function(error, response, body) {
        var json = JSON.parse(body);
        if(!json.items[0]) callback("novid");
        else{
        	callback(json.items[0].id.videoId);
        }
    });
}

function getID(str, cb) {
	if(isYoutube(str)) {
        cb(getYouTubeID(str));
    } else {
        search_video(str, id => {
            cb(id);
        });
    }
}

function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}

function playMusic(id, message){
	bot.musicguilds[message.guild.id].voiceChannel.join().then(connection => {
		bot.musicguilds[message.guild.id].dispatcher = connection.play(ytdl("https://www.youtube.com/watch?v=" + id, {filter:"audioonly",quality: 'highestaudio',highWaterMark: 1024 * 1024 * 10}));
		bot.musicguilds[message.guild.id].dispatcher.setVolume(bot.guildSettings[message.guild.id].botVolume);
		bot.musicguilds[message.guild.id].dispatcher.on('error', e => console.log(e));
		bot.musicguilds[message.guild.id].dispatcher.on('finish', () => {
			if (!bot.guildSettings[message.guild.id].repeat) bot.guildSettings[message.guild.id].queue.shift();
			if(bot.guildSettings[message.guild.id].queue.length === 0){
				bot.guildSettings[message.guild.id].queue = [];
				bot.musicguilds[message.guild.id].isPlaying = false;
				connection.disconnect;
				bot.musicguilds[message.guild.id].voiceChannel.leave();
			}
			else {
				setTimeout(() => {
					playMusic(bot.guildSettings[message.guild.id].queue[0].id, message);
				});
			}
		});
	});
}

module.exports.help = {
	name: "play",
	altname: "p",
	type: "music",
	desc: "Plays a specified song, or searches youtube for a song.",
	example: "!play [youtube link] *or* [string to search youtube with]\nAlso simply !play to resume playback of paused, or restarted bot (with songs in queue)"
}
