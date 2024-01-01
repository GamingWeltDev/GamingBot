const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ExtendedClient = require('../../../class/ExtendedClient');
const ticketSetupSchema = require("../../../schemas/ticketSetupSchema");
const ticketSchema = require("../../../schemas/ticketSchema");

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Hauptbefehl für Tickets. (in arbeit)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(command => command
          .setName("setup")
          .setDescription("Einrichten eines Ticketsystems für den Discord-Server.")
          .addChannelOption(option => option.setName("feedback-channel").setDescription("Der Kanal, wo Feedback reingesendet werden soll").addChannelTypes(ChannelType.GuildText).setRequired(true))
          .addChannelOption(option => option.setName("ticket-channel").setDescription("Der Kanal, wo Tickets erstellt werden sollen").addChannelTypes(ChannelType.GuildText).setRequired(true))
          .addRoleOption(option => option.setName("staff-role").setDescription("Die Rolle, die Tickets sehen kann").setRequired(true))
          .addStringOption(option => option.setName("ticket-type").setDescription("Der Typ des Tickets, entweder Modal oder Button").addChoices(
            {name: 'Modal', value: 'modal'},
            {name: 'Button', value: 'button'}
          ).setRequired(true)))
        .addSubcommand(command => command
          .setName("add")   
          .setDescription("Füge ein Mitglied zu diesem Ticket hinzu.")
          .addUserOption(option => option.setName('member').setDescription('Der Mitglied, der hinzugefügt werden soll.').setRequired(true)))
        .addSubcommand(command => command
          .setName("remove")   
          .setDescription("Entferne ein Mitglied von diesem Ticket.")
          .addUserOption(option => option.setName('member').setDescription('Der Mitglied, das entfernt werden soll.').setRequired(true))),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
      const { channel, options, guild } = interaction;

      const sub = options.getSubcommand();

      switch (sub) {
          case "setup":
            if (interaction.member.permissions.has([PermissionFlagsBits.Administrator])) {
              const staffRole = options.getRole('staff-role')
              const feedbackChannel = options.getChannel('feedback-channel')
              const ticketChannel = options.getChannel('ticket-channel')
              const ticketType = options.getString('ticket-type')

              await interaction.deferReply({ ephemeral: true });

              const buttonTicketCreateEmbed = new EmbedBuilder()
              .setTitle('Ticket System')
              .setDescription('Klicken Sie auf die Schaltfläche unten, um ein Ticket zu erstellen.')
              .setColor('Green')
              .setFooter({ text: `Support Tickets` })
              .setTimestamp();

              const modalTicketCreateEmbed = new EmbedBuilder()
              .setTitle('Ticket System')
              .setDescription('Klicken Sie auf die Schaltfläche unten, um ein Ticket zu erstellen.')
              .setColor('Green')
              .setFooter({ text: `Support Tickets` })
              .setTimestamp();

              const ticketSetupEmbed = new EmbedBuilder()
              .setTitle('Ticket System Setup')
              .setColor('DarkGreen')
              .setDescription('Das Ticket-System wurde mit den folgenden Einstellungen eingerichtet:')
              .addFields(
                { name: 'Ticket Kanal', value: `${ticketChannel}`, inline: true},
                { name: 'Feedback Kanal', value: `${feedbackChannel}`, inline: true},
                { name: 'Team Rolle', value: `${staffRole}`, inline: true},
                { name: 'Ticket Typ', value: `${ticketType}`, inline: true},
              )
              .setTimestamp();

              const openTicketButton = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                  .setCustomId('supportTicketBtn')
                  .setLabel('Ticket erstellen')
                  .setStyle(ButtonStyle.Secondary),
              ]);

              let setupTicket = await ticketSetupSchema.findOne({
                ticketChannelID: ticketChannel.id,
              });

              if (setupTicket) {
                return await interaction.editReply({
                  content: 'Dieser Kanal ist bereits als Ticket-Kanal eingerichtet.',
                })
              } else {
                setupTicket = await ticketSetupSchema.create({
                  guildID: guild.id,
                  ticketChannelID: ticketChannel.id,
                  feedbackChannelID: feedbackChannel.id,
                  staffRoleID: staffRole.id,
                  ticketType: ticketType,
                });

                await setupTicket.save().catch((err) => console.log(err));
              }

              if (ticketType === 'button') {
                await ticketChannel.send({
                  embeds: [buttonTicketCreateEmbed],
                  components: [openTicketButton],
                });
              } else {
                await ticketChannel.send({

                  embeds: [modalTicketCreateEmbed],
                  components: [openTicketButton],
                });
              }

              return await interaction.editReply({
                embeds: [ticketSetupEmbed],
              });
            } else {
              return await interaction.editReply({ content: "Sie haben nicht die Erlaubnis, diesen Unterbefehl zu verwenden.", ephemeral: true });
            }
          break;
          case "add":
            if (interaction.member.permissions.has([PermissionFlagsBits.ManageMessages])) {
              const { channel, options, guild } = interaction;

              await interaction.deferReply({ ephemeral: true });

              const memberToAdd = options.getUser('member');

              const ticket = await ticketSchema.findOne({
                guildID: guild.id,
                ticketChannelID: channel.id,
                closed: false
              });

              if (!ticket) {
                return await interaction.editReply({
                  content: 'Dies ist kein Ticket kanal.'
                })
              }

              const memberExistsInServer = guild.members.cache.find(mbr => mbr.id === memberToAdd.id);
              if (!memberExistsInServer) {
                return await interaction.editReply({
                  content: 'Das Mitglied, welches sie ausgewählt haben ist nicht im Server.'
                })
              }

              const threadMember = await channel.member.fetch(memberToAdd.id).catch(err => {
                console.log(err);
              });

              if (threadMember) {
                return await interaction.editReply({
                  content: 'Das Mitglied ist bereits in diesem Ticket.'
                });
              }

              ticket.membersAdded.push(memberToAdd.id);
              ticket.save();

              await channel.members.add(memberToAdd.id);

              return await interaction.editReply({
                content: `Das Mitglied ${memberToAdd} wurde erfolgreich hinzugefügt.`
              });
            } else {
              return await interaction.editReply({ content: "Sie haben nicht die Erlaubnis, diesen Unterbefehl zu verwenden.", ephemeral: true });
            }
          break;
          case "remove":
            if (interaction.member.permissions.has([PermissionFlagsBits.ManageMessages])) {
              await interaction.deferReply({ ephemeral: true });

              const memberToRemove = options.getUser('member');

              const ticket = await ticketSchema.findOne({
                guildID: guild.id,
                ticketChannelID: channel.id,
                closed: false
              });

              if (!ticket) {
                return await interaction.editReply({
                  content: 'Dies ist kein Ticket kanal.'
                })
              }

              const memberExistsInServer = guild.members.cache.find(mbr => mbr.id === memberToRemove.id);
              if (!memberExistsInServer) {
                return await interaction.editReply({
                  content: 'Das Mitglied, welches sie ausgewählt haben ist nicht im Server.'
                })
              }

              const threadMember = await channel.member.fetch(memberToRemove.id).catch(err => {
                console.log(err);
              });

              if (!threadMember) {
                return await interaction.editReply({
                  content: 'Das Mitglied ist nicht in diesem Ticket.'
                });
              }

              await ticketSchema.findOneAndUpdate({
                guildID: guild.id,
                ticketChannelID: channel.id,
                closed: false,
              },
              {
                $pull: {
                  membersAdded: memberToRemove.id,
                },
              })
              ticket.save();

              await channel.members.remove(memberToRemove.id);

              return await interaction.editReply({
                content: `Das Mitglied ${memberToRemove} wurde erfolgreich entfernt.`
              });
            } else {
              return await interaction.editReply({ content: "Sie haben nicht die Erlaubnis, diesen Unterbefehl zu verwenden.", ephemeral: true });
            }
          break;
      }
    }
};