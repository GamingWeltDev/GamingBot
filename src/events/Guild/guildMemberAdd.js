const { EmbedBuilder, GuildMember } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

module.exports = {
  event: "guildMemberAdd",
  once: false,
  /**
   *
   * @param {ExtendedClient} client
   * @param {GuildMember} member
   * @returns
   */
  run: (client, member) => {
    if (member.guild.id !== "1172894758553788466") return;

    const guild = client.guilds.cache.get("1172894758553788466");
    const channel = guild.channels.cache.get("1172906905987989504");

    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle(`Willkommen, ${member.user.username}`)
      .setDescription(
        `<@${member.user.id}> Willkommen auf **${member.guild.name}** 👋\n\n__Viel Spaß, auf diesem Server!__`,
      )
      .setFooter({
        text: `Wir haben nun ${member.guild.memberCount} Mitglieder`,
      })
      .setTimestamp();

    channel.send({ embeds: [embed] });
  },
};
