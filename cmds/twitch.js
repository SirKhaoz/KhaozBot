const Discord = module.require("discord.js");
const nodefetch = require("node-fetch");
const botSettings = require("../resources/keys.json");
const apiUrl = "https://api.twitch.tv";
const timeout = 5*60000;
const https = require("https");

var server, twitchChannels;
//TODO, fix this whole command with new twitch API
module.exports.run = async (bot, message, args) => {
	let action = args[0];
	//Quick check to see if user has not given a name.
	if(!action){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.channel.send("Please enter a paramter for the !twitch command.");
		msg.delete({timeout:7000});
		return;
	}
	if(action != "list" && !args[1]){
		//Reply letting the user know, then delete the message after 7 seconds.
		let msg = await message.channel.send("Please enter a paramater for the !twtich command.");
		msg.delete({timeout:7000});
		return;
	}

	args = args.slice(1);

  server =  bot.guildSettings[message.guild.id];
  twitchChannels = bot.guildSettings[message.guild.id].twitchChannels;

  var streamer;
  if(action == "remove"){
  	if(!message.member.permissions.has("ADMINISTRATOR")) {
			let msg = await message.reply("You do not have permission to remove a streamer from the twitch list.");
			msg.delete({timeout:7000}).catch(err => console.error(err));
			return;
		}
	  streamer = args.join(" ").trim();
	  index = indexOfObjectByName(twitchChannels, streamer);
	  if(index != -1){
	      twitchChannels.splice(index, 1);
	      index = indexOfObjectByName(twitchChannels, streamer);
	      if(index == -1){
	          message.reply("Removed " + streamer + ".");
	      }else{
	          message.reply(streamer + " isn't in the list of notified streamers.");
	      }
	  }else{
	      message.reply(streamer + " isn't in the list of notified streamers.");
	  }
  }else if(action == "add"){
  	if(!message.member.permissions.has("ADMINISTRATOR")) {
			let msg = await message.reply("You do not have permission to add streamer to the twitch list.");
			msg.delete({timeout:7000}).catch(err => console.error(err));
			return;
		}
    streamer = args.join(" ").trim();

		getStreamerID(streamer, (res) => {
	    index = indexOfObjectByName(twitchChannels, streamer);

			if(index != -1){
					message.reply(streamer + " is already in the list of notified streamers.");
			}else if(res){
					twitchChannels.push({name: streamer,id:res.id,timestamp: 0, online: false});
					message.reply("Added " + streamer + " to the twitch list.");
			}else{
					message.reply(streamer + " doesn't seem to exist in the twitch database. Did you type it correctly?");
			}
		});

  }else if(action == "list"){
      let msg = "\n";
      for(let i = 0; i < twitchChannels.length; i++){
          var streamStatus;
          if(twitchChannels[i].online){
              msg += "**" + twitchChannels[i].name + " is online!**\n";
          }else{
              streamStatus = "offline";
              msg += twitchChannels[i].name + " is offline.\n";
          }
      }
      if(!msg){
          message.reply("The list is empty.");
      }else{
          message.reply(msg.replace(/_/g, "\\_"));
      }

  }
}

function leadingZero(d){
    if(d < 10){
        return "0" + d;
    }else{
        return d;
    }
}

// adds a timestamp before msg/err
function print(msg, err){
    var date = new Date();
    var h = leadingZero(date.getHours());
    var m = leadingZero(date.getMinutes());
    var s = leadingZero(date.getSeconds());

    console.log("[" + h + ":" + m + ":" + s + "]", msg);
    if(err){
        console.error(err);
    }
}

function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].name.toLowerCase().trim() === value.toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

function getStreamerID(name, callback){
	var apiPath = "/helix/users?login=" + name.trim();
	var opt = {
			host: "api.twitch.tv",
			path: apiPath,
			headers: {
					"Client-ID": botSettings.twitchClientID,
					Accept: "application/vnd.twitchtv.v5+json"
			}
	};
	https.get(opt, (res)=>{
		var body = "";

		res.on("data", (chunk)=>{
			body += chunk;
		});

		res.on("end", ()=>{
			var json;
			try {
				json = JSON.parse(body);
			}
			catch(err){
				print(err);
				return;
			}
			if(json.status == 404){
				return callback(undefined);
			}else{
				//console.log("get streamer ID JSON",json)
				return callback(json.data[0]);
			}
		});

	}).on("error", (err)=>{
		print(err);
	});
}

exports.callApi = function(server, twitchChannel, callback){
    var apiPath = "/helix/streams?user_login=" + twitchChannel.name;
    var opt = {
        host: "api.twitch.tv",
        path: apiPath,
        headers: {
            "Client-ID": botSettings.twitchClientID,
            Accept: "application/vnd.twitchtv.v5+json"
        }
    };
    https.get(opt, (res)=>{
      var body = "";

      res.on("data", (chunk)=>{
        body += chunk;
      });

      res.on("end", ()=>{
        var json;
        try {
          json = JSON.parse(body);
        }
        catch(err){
          print(err);
          return;
        }
        if(json.status == 404){
          callback(server, twitchChannel, undefined);
        }else{
          callback(server, twitchChannel, json);
        }
      });

    }).on("error", (err)=>{
      print(err);
    });
}

exports.apiCallback = function(server, twitchChannel, res){
	//console.log("stream JSON", res.data[0]);
	let stream = res.data[0];
  if(stream && !twitchChannel.online && twitchChannel.timestamp + timeout <= Date.now()){
    try {
      var guild = bot.guilds.cache.get(server.guildID);
      var channel = guild.channels.cache.get(bot.guildSettings[server.guildID].twitchchannel);

      var embed = new Discord.MessageEmbed()
        .setColor("#9689b9")
        .setTitle(stream.user_name.replace(/_/g, "\\_") + " - CLICK HERE TO WATCH")
        .setURL("https://twitch.tv/" + stream.user_name)
        .setDescription(`${stream.user_name.replace(/_/g, "\\_")} is now **${stream.type}**!!\n\nPlaying: ${stream.game_id} (this is a game ID - I need to look this up against twich's list.)`)
        .setImage(stream.thumbnail_url.replace(/-{width}x{height}/g, ''))
        .setThumbnail(stream.thumbnail_url.replace(/-{width}x{height}/g, ''))
        .addField("Viewers", stream.viewer_count, true)
				.addField("Followers", "TODO", true)
				.addField("Thumbnail Fix", "fix the thumbnail <@78306944179245056>", true)
        //.addField("Followers", res.stream.channel.followers, true);

      channel.send(embed).then(
          print(`Sent embed to channel '${channel.name}' in guild '${guild.name}'.`)
      );
      twitchChannel.online = true;
      twitchChannel.timestamp = Date.now();
    }
    catch(err){
        print(err);
    }
  }else if(stream == null){
    twitchChannel.online = false;
  }
}

exports.tick = function(){
  for(var key in bot.guildSettings){
    for(let j = 0; j < bot.guildSettings[key].twitchChannels.length; j++){
      if(bot.guildSettings[key].twitchChannels[j]){
        exports.callApi(bot.guildSettings[key], bot.guildSettings[key].twitchChannels[j], exports.apiCallback);
      }
    }
  }
}

module.exports.help = {
	name: "twitch",
  type: "static",
	desc: "Twitch commands to add, remove or list watched twitch streams.",
	example: "!twitch [command] *or* !twitch [command] [command option]",
	detail: `**!twitch add [streamer]** - *This is to add a streamer to the watched list\n\
**!twitch remove [streamer]** - *This is to remove a stream from the watched list\n\
**!twitch list** - *This is to list`
}
