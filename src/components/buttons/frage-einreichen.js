const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

module.exports = {
  customId: "frageeinreichenbtn",
  /**
   *
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setTitle("Frage Einreichen")
      .setCustomId("frageeinreichen");

    const frageInput = new TextInputBuilder()
      .setLabel("Deine Frage")
      .setCustomId("frage")
      .setPlaceholder("Welche Minecraft Edition findet ihr besser?")
      .setStyle(TextInputStyle.Short)
      .setMinLength(10)
      .setMaxLength(150)
      .setRequired(true)

    const antwortmoeglichkeitenInput = new TextInputBuilder()
      .setLabel("Deine Antwortmöglichkeiten")
      .setCustomId("auswahl")
      .setPlaceholder(`Jede Antwortmöglichkeit in einer neuen Zeile, z.B:\nJava\nBedrock\nBeide sind gleich gut`)
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(10)
      .setMaxLength(800)
      .setRequired(true)

    const firstActionRow = new ActionRowBuilder().addComponents(frageInput);
    const secondActionRow = new ActionRowBuilder().addComponents(antwortmoeglichkeitenInput);

    modal.addComponents(firstActionRow, secondActionRow)

    try {
      await interaction.showModal(modal);
    } catch {
      await interaction.reply({ content: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.", ephemeral: true })
    }
  },
};
