const { ChannelType, Message, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const { log } = require("../../functions");
const counting = require("../../schemas/countingSchema");
const stickySchema = require("../../schemas/stickySchema");
const ExtendedClient = require("../../class/ExtendedClient");

module.exports = {
  event: "messageCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    /* Counting Stuff */
    const countingData = await counting.findOne({ Guild: message.guild.id });
    
    if (countingData) {
      if (message.channel.id === countingData.Channel) {
        const number = Number(message.content)

        if (number !== countingData.Number) {
          return message.react(`❌`)
          
        } else if (countingData.LastUser === message.author.id) {
          const msg = await message.reply({ content: `❌ Jemand anderes muss diese Zahl zählen/nennen` })
          
          await message.react(`❌`)
          
          setTimeout(async () => {
            await msg.delete();
            await message.delete();
          }, 5000);
        } else {
          await message.react(`✅`)

          countingData.LastUser = message.author.id;
          countingData.Number++;
          await countingData.save();
        }
      }
    }

    /* Sticky Stuff */
    const stickyData = await stickySchema.findOne({ ChannelID: message.channel.id });

    if (stickyData) {
      let channel = stickyData.ChannelID
      let cachedchannel = client.channels.cache.get(channel);

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(stickyData.Message)

      if (message.channel.id == channel) {
        stickyData.CurrentCount += 1
        stickyData.save();

        if (stickyData.CurrentCount >= stickyData.MaxCount) {
          try {
            client.channels.cache.get(channel).messages.fetch(stickyData.LastMessageID).then(msg => msg.delete());

            let newMessage = await cachedchannel.send({ embeds: [embed] });

            stickyData.LastMessageID = newMessage.id;
            stickyData.CurrentCount = 0;
            stickyData.save();
          } catch {
            return;
          }
        }
      }
    }
  },
}