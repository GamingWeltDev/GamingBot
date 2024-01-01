const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const ticketSetupSchema = require("../../schemas/ticketSetupSchema");
const ticketSchema = require("../../schemas/ticketSchema");

const blacklist = ["0"]

module.exports = {
  customId: "supportTicketBtn",
  /**
   *
   * @param {ExtendedClient} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    try {
      const { channel, guild, member } = interaction;

      if (blacklist.includes(member.id)) {
        return await interaction.reply({ content: `**Fehler 429**: Zu Viele Requests - Du hast zu viele Anfragen eingereicht. Bitte versuche es später erneut, oder kontaktiere den Systemadministrator.`, ephemeral: true });
      }

      const ticketSetup = await ticketSetupSchema.findOne({
        guildID: guild.id,
        ticketChannelID: channel.id,
      });

      if (!ticketSetup) {
        return await interaction.editReply({
          content:
            "Das Ticketsystem ist noch nicht eingerichtet. Bitte kontaktieren Sie einen Administrator, um es einzurichten.",
        });
      }

      if (ticketSetup.ticketType === "modal") {
        const ticketModal = new ModalBuilder()
          .setTitle("Ticket System")
          .setCustomId("ticketMdl")
          .setComponents(
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("Ticket Subjekt")
                .setCustomId("ticketSubject")
                .setPlaceholder("Gebe ein Subjekt für dein Ticket an")
                .setStyle(TextInputStyle.Short),
            ),
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("Ticket Beschreibung")
                .setCustomId("ticketDesc")
                .setPlaceholder("Gebe eine Beschreibung für dein Ticket an")
                .setStyle(TextInputStyle.Paragraph),
            ),
          );

        return interaction.showModal(ticketModal);
      } else {
        await interaction.deferReply({ ephmeral: true });

        const ticketChannel = guild.channels.cache.find(
          (ch) => ch.id === ticketSetup.ticketChannelID,
        );

        const staffRole = guild.roles.cache.get(ticketSetup.staffRoleID);
        const username = member.user.globalName ?? member.user.username;

        const ticketEmbed = new EmbedBuilder()
          .setColor("DarkGreen")
          .setAuthor({
            name: username,
            iconURL: member.user.displayAvatarURL(),
          })
          .setDescription(
            "Ein Teammitglied wird bald antworten.\nBitte erkläre dein Anliegen so detailliert wie möglich.",
          )
          .setFooter({
            text: `${guild.name} - Ticket`,
            iconURL: guild.iconURL(),
          })
          .setTimestamp();

        const ticketButtons = new ActionRowBuilder().setComponents([
          new ButtonBuilder()
            .setCustomId("closeTicketBtn")
            .setLabel("Ticket schließen")
            .setStyle(Button.Danger),
          new ButtonBuilder()
            .setCustomId("lockTicketBtn")
            .setLabel("Ticket sperren")
            .setStyle(Button.Success),
        ]);

        let ticket = await ticketSchema.findOne({
          guildID: guild.id,
          ticketMemberID: member.id,
          parentTicketChannelID: channel.id,
          closed: false,
        });

        const ticketCount = await ticketSchema.findOne({
            guildID: guild.id,
            ticketMemberID: member.id,
            parentTicketChannelID: channel.id,
            closed: true,
        }).count();

        if (ticket) {
          return await interaction.editReply({
            content: 'Du hast noch ein offenes Ticket.'
          })
        }

        const thread = await ticketChannel.threads.create({
          name: `${ticketCount + 1} - ${username}'s Ticket`,
          type: ChannelType.PrivateThread,
        })

        await thread.send({
          content: `${staffRole} - Ticket erstellt von ${member}`,
          embeds: [ticketEmbed],
          components: [ticketButtons],
        });

        if (!ticket) {
          ticket = await ticketSchema.create({
            guildID: guild.id,
            ticketMemberID: member.id,
            parentTicketChannelID: channel.id,
            ticketChannelID: thread.id,
            closed: false,
            membersAdded: [ ]
          });

          await ticket.save().catch(err => console.log(err));
        }

        return await interaction.editReply({
          content: `Dein Ticket wurde erfolgreich erstellt in ${thread}.`,
        })
      }
    } catch (err) {
      console.log(err);
    }
  },
};
