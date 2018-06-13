// https://discordapp.com/oauth2/authorize?client_id=448479589132402698&scope=bot

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (error, files) => {
  if(error) console.log(error);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});


bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);

  bot.user.setActivity(" ", {type: "$"});

});

bot.on("message", async (message) => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  // if(cmd === `${prefix}MJ`){
  //   return message.channel.send("O_O");
  // }else if(cmd === `${prefix}然後呢`){
  //   return message.channel.send("他們說妳的心似乎痊癒了。");
  // }else if(cmd === `${prefix}真的是`){
  //   return message.channel.send("會被妳給氣死ㄟ");
  // }else if(cmd === `${prefix}學弟的覽趴`){
  //   return message.channel.send("好ㄘ");
  // }

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot, message, args);

});

bot.login(botconfig.token);
