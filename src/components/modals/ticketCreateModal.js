const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType
} = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const ticketSetupSchema = require('../../schemas/ticketSetupSchema');
const ticketSchema = require('../../schemas/ticketSchema');

module.exports = {
    customId: 'ticketMdl',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {*} interaction 
     */
    run: async (client, interaction) => {
      const { fields, guild, member, channel } = interaction;

      const sub = fields.getTextInputValue('ticketSubject');
      const desc = fields.getTextInputValue('ticketDesc');

      await interaction.deferReply({ ephemeral: true });
      
      const ticketSetup = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id
      });

      const ticketChannel = guild.channels.cache.find(ch => ch.id === ticketSetup.ticketChannelID);
      const staffRole = guild.roles.cache.get(ticketSetup.staffRoleID);
      const username = member.user.globaleName ?? member.user.username;
      const logChannel = guild.channels.cache.get(ticketSetup.feedbackChannelID);

      const ticketEmbed = new EmbedBuilder()
        .setColor('DarkGreen')
        .setAuthor({ name: username, iconURL: member.user.displayAvatarURL({ dynamic: true })})
        .setDescription(`**Thema:** ${sub}\n**Beschreibung:** ${desc}`)
        .setFooter({
          text: `${guild.name} - Ticket`,
          iconURL: guild.iconURL()
        })
        .setTimestamp();

      const ticketButtons = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId('closeTicketBtn')
          .setLabel('Ticket Schließen')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('lockTicketBtn')
          .setLabel('Ticket Sperren')
          .setStyle(ButtonStyle.Success),
      ]);

      let ticket = await ticketSchema.findOne({
        guildID: guild.id,
        ticketMemberID: member.id,
        parentticketChannelID: channel.id,
        closed: false
      });

      const ticketCount = await ticketSchema.findOne({
        guildID: guild.id,
        ticketMemberID: member.id,
        parentticketChannelID: channel.id,
        closed: true
      }).count();

      if (ticket) {
        return await interaction.editReply({
          content: `Du hast bereits ein Ticket erstellt.`
        });
      }

      const thread = await ticketChannel.threads.create({
        name: `${ticketCount + 1} - ${username}'s Ticket`,
        type: ChannelType.PrivateThread,
      })

      await thread.send({
        content: `Ticket erstellt von ${member}`,
        embeds: [ticketEmbed],
        components: [ticketButtons],
      })
      
      if (!ticket) {
        ticket = await ticketSchema.create({
          guildId: guild.id,
          ticketMemberID: member.id,
          ticketChannelID: thread.id,
          parentticketChannelID: channel.id,
          closed: false,
          membersAdded: [ ],
        });
        
        await ticket.save().catch(err => console.log(err));
      }

      const ticketLogEmbed = new EmbedBuilder()
        .setColor(0xBFFF00)
        .setTitle(`Ticket Geöffnet. (${channel.name})`)
        .addFields(
          { name: `Erstellt von`, value: `Benutzer <@${member.id}>` },
          { name: `Erstellt am`, value: `Zeitpunkt <t:${Math.floor(Date.now() / 1000)}:f>` },
          { name: `Ticket`, value: `Kanal <#${thread.id}> (${thread.name})` },
        )
        .setImage('https://cdn.discordapp.com/attachments/1172897524982497291/1190084040464814211/badge.png'); 

      await logChannel.send({
        embeds: [ticketLogEmbed]
      })
      
      return await interaction.editReply({
        content: `Dein Ticket wurde erstellt in ${thread}`
      });
    }
};