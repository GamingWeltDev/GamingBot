const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const config = require("../../../config");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Zeigt alle möglichen Befehle an!")
    .setDMPermission(false),
  options: {
    cooldown: 15000,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const mapIntCmds = client.applicationcommandsArray.map(
      (v) =>
        `\`${v.type === 2 || v.type === 3 ? "" : "/"}${v.name}\`: ${
          v.description || "(Keine Beschreibung verfügbar)"
        }`,
    );

    await interaction.followUp({
      embeds: [
        new EmbedBuilder()
          .setTitle("Hilfe-Befehl")
          .addFields({ name: "Befehle", value: `${mapIntCmds.join("\n")}` }),
      ],
    });
  },
};
