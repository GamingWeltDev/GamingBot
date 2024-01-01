const { EmbedBuilder, GuildMember, Embed } = require("discord.js");
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    event: 'guildMemberUpdate',
    /**
     * 
     * @param {ExtendedClient} client
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @returns 
     */
    run: (client, oldMember, newMember) => {
      if (!oldMember.premiumSince && newMember.premiumSince) {
        const guild = client.guilds.cache.get(newMember.guild.id);
      
        const boostChannel = guild.channels.cache.get("1190025645087010886")
        const chatChannel = guild.channels.cache.get("1172906905987989504")
        
        const boostEmbed = new EmbedBuilder()
          .setTitle(`Oha, Ein Neuer Booster!`)
          .setColor(0x9a7fae)
          .setDescription(`Danke, <@${newMember.id}> für das Boosten!`)
          .setFooter({ text: `Wir haben nun: ${newMember.guild.premiumSubscriptionCount} boosts!` });

        boostChannel.send({ embeds: [ boostEmbed ] })
        chatChannel.send({ embeds: [ boostEmbed ] })
      }
    }
};