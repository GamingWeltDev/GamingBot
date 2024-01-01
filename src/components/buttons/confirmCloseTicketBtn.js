const {
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const ExtendedClient = require("../../class/ExtendedClient");
const ticketSetupSchema = require("../../schemas/ticketSetupSchema");
const ticketSchema = require("../../schemas/ticketSchema");

module.exports = {
  customId: "confirmCloseTicketBtn",
  /**
   *
   * @param {ExtendedClient} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    try {
      const { channel, guild } = interaction;
      
      const closingEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle('Ticket wird geschlossen')
        .setDescription('Wird geschlossen...')

      await interaction.deferReply();

      const closedEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle('Ticket geschlossen')
        .setDescription('Dieses Ticket wurde geschlossen.')

      const transcript = await discordTranscripts.createTranscript(channel);

      const setupTicket = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.parentId,
      });

      const ticket = await ticketSchema.findOne({
        ticketChannelID: channel.id,
        closed: false
      });

      if (!ticket || ticket.closed === true) {
        return await interaction.editReply({
          content: `Das Ticket ist bereits geschlossen.`
        })
      }

      await channel.send({ embeds: [closingEmbed] });
      
      const staffRole = guild.roles.cache.get(setupTicket.staffRoleID);
      const hasRole = staffRole.members.has(ticket.ticketMemberID);
      const ticketUser = client.users.cache.get(ticket.ticketMemberID);
      const logChannel = guild.channels.cache.get(setupTicket.feedbackChannelID);
      
      if (!hasRole) {
        ticket.membersAdded.map(async (member) => {
          await channel.members.remove(member)
        });
        await channel.members.remove(ticket.ticketMemberID);
      }

      await ticketSchema.findOneAndUpdate({
        ticketChannelID: channel.id,
        closed: false
      }, {
        closed: true
      });

      await channel.setArchived(true);

      const ticketUserEmbed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle(`Dein Ticket wurde geschlossen. (${channel.name})`)
        .setDescription(`Hey, <@${ticketUser.id}>.\nDein Ticket auf [${guild.name}](https://discord.com/channels/${guild.id}) wurde geschlossen.\nIch hoffe wir konnten dein Anliegen klären!\nIch habe dir den Chatverlauf des Tickets angehangen in der Nachricht hierdrunter.`)
        .setImage('https://cdn.discordapp.com/attachments/1172897524982497291/1190084040464814211/badge.png');
      
      const ticketLogEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`Ticket geschlossen. (${channel.name})`)
        .addFields(
          { name: `Gelöscht von`, value: `Benutzer <@${interaction.user.id}>` },
          { name: `Gelöscht am`, value: `Zeitpunkt <t:${Math.floor(Date.now() / 1000)}:f>` },
          { name: `Ticket`, value: `Kanal <#${channel.id}> (${channel.name})` },
        )
        .setImage('https://cdn.discordapp.com/attachments/1172897524982497291/1190084040464814211/badge.png');
      
      await ticketUser.send({
        embeds: [ticketUserEmbed],
        files: [transcript]
      });

      await logChannel.send({
        embeds: [ticketLogEmbed],
        files: [transcript]
      });

      return await interaction.editReply({
        embeds: [closedEmbed],
        components: [],
      })
    } catch (err) {
      console.log(err);
    }
  },
};
