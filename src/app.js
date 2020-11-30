const fs = require("fs");
const { prefix: PREFIX } = require("../config.json");
const Discord = require("discord.js");
const dotenv = require("dotenv");
const { TypeBackResponse } = require("./alternativeCommands");
dotenv.config();
const client = new Discord.Client();

/**
 * Load external commands
 */
loadExternalCommands();

/**
 * Run when 'ready' event fires
 */
client.once("ready", () => {
	console.log("Ready!");
	client.user
		.setActivity("everyone...", { type: "WATCHING" })
		.then((presence) =>
			console.log(`Activity set to ${presence.activities[0].name}`)
		)
		.catch(console.error);
});

/**
 *  Run when a message is recieved
 */
client.on("message", (message) => {
	console.log(message);
	if (!message.content.startsWith(PREFIX) || message.author.bot) {
		return;
	}
	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		const errorEmbed = new Discord.MessageEmbed().setColor("#EF5858").addFields(
			{
				name: "ERROR",
				value: `command *${command}* not found.`,
				inline: true,
			},
			{ name: "USER", value: `<@${message.author.id}>`, inline: true }
		);
		message.reply(errorEmbed);
	}
});

/**
 * Make users sus when they start typing; make it look like the bot is also typing.
 */
client.on("typingStart", (channel) => {
	TypeBackResponse(channel);
});

/**
 * login
 */
client.login(process.env.BOT_TOKEN);

function loadExternalCommands() {
	client.commands = new Discord.Collection();

	const commands = fs
		.readdirSync(__dirname + "/commands/")
		.filter((file) => file.endsWith(".js"));

	commands.forEach((commandFile) => {
		const command = require(`./commands/${commandFile}`);
		client.commands.set(command.name, command);
	});
}
