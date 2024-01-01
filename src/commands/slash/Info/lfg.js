const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const ms = require("ms");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("lfg")
    .setDescription(
      "Looking for Group (Suche nach Gruppe) - Zeigt dir Spieler an, die das angegebene Spiel spielen.",
    )
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("game")
        .setDescription("Der name des Spieles, nachdem du suchen tust.")
        .setRequired(true),
    ),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    var { options } = interaction;
    var game = options.getString("game");

    var members = await interaction.guild.members.fetch();

    var group = [];
    members.forEach(async (member) => {
      if (!member.presence || !member.presence.activities[0]) return;

      var currentGame = member.presence.activities[0].name;

      if (currentGame.toLowerCase() == game.toLowerCase())
        group.push({ member: member.id, game: currentGame });
      else return;
    });

    group = group.slice(0, 200);

    const embed = new EmbedBuilder().setColor("Blurple");

    var string;
    group.forEach((value) => {
      const member = interaction.guild.members.cache.get(value.member);
      string += `Mitglied: **${member.user.username}** (${value.member}) spielt gerade ${value.game}!\n`;
    });

    if (string) {
      string = string.replace("undefined", "");

      embed.setTitle(`Mitglieder die ${game} Spielen`).setDescription(string);
    } else {
      embed.setDescription(
        `👉 Sieht so aus, als würde niemand \`${game}\` spielen.`,
      );
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
