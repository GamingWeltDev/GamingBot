const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const { RockPaperScissors } = require("discord-gamecord");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Spiele Schere, Stein, Papier")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("Die Person gegen die du Spielen möchtest")
        .setRequired(true),
    ),
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const { options } = interaction;
    const opponent = options.getUser("opponent");

    const Game = new RockPaperScissors({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: "Schere Stein Papier",
        color: "#5865F2",
        description:
          "Drücken Sie eine der unten stehenden Tasten, um eine Auswahl zu treffen.",
        requestTitle: "Spiel-Anfrage",
        requestColor: "#57F287",
        rejectTitle: "Abgebrochene Anfrage",
        rejectColor: "#ED4245",
      },
      buttons: {
        rock: "Stein",
        paper: "Papier",
        scissors: "Schere",
        accept: "Akzeptieren",
        reject: "Ablehnen",
      },
      emojis: {
        rock: "🪨",
        paper: "📰",
        scissors: "✂️",
      },
      reqTimeoutTime: 30000,
      requestMessage:
        "{player} hat dich zu einer Runde **Schere Stein Papier** eingeladen.",
      rejectMessage: "Ihr ausgewählter Gegner hat Ihre Anfrage abgelehnt.",
      reqTimeoutMessage:
        "Das Spiel wurde abgebrochen, da der Spieler nicht reagiert hat.",
      mentionUser: true,
      timeoutTime: 60000,
      buttonStyle: "PRIMARY",
      pickMessage: "Du wählst {emoji}.",
      winMessage:
        "**{player}** hat das Spiel gewonnen! Herzlichen Glückwunsch!",
      tieMessage:
        "Das Spiel steht unentschieden! Keiner hat das Spiel gewonnen!",
      timeoutMessage:
        "Das Spiel wurde nicht zu Ende gespielt! Keiner hat das Spiel gewonnen!",
      playerOnlyMessage:
        "Nur {player} und {opponent} können diese Schaltflächen verwenden.",
    });

    Game.startGame();
  },
};
