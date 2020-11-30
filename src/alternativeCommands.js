function TypeBackResponse(channel) {
	console.log(channel);
	channel.startTyping(1);
	channel.stopTyping(1);
}
exports.TypeBackResponse = TypeBackResponse;
