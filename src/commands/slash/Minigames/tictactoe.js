const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const { TicTacToe } = require("discord-gamecord");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("ttt")
    .setDescription("Spiele TicTacToe")
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

    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: opponent,
      embed: {
        title: "Tic Tac Toe",
        color: "#5865F2",
        statusTitle: "Status",
        overTitle: "Game Over",
        requestTitle: "Spiel-Anfrage",
        requestColor: "#57F287",
        rejectTitle: "Abgebrochene Anfrage",
        rejectColor: "#ED4245",
      },
      emojis: {
        xButton: "❌",
        oButton: "🔵",
        blankButton: "➖",
      },
      buttons: {
        accept: "Akzeptieren",
        reject: "Ablehnen",
      },
      reqTimeoutTime: 30000,
      requestMessage:
        "{player} hat dich zu einer Runde **TicTacToe** eingeladen.",
      rejectMessage: "Ihr ausgewählter Gegner hat Ihre Anfrage abgelehnt.",
      reqTimeoutMessage:
        "Das Spiel wurde abgebrochen, da der Spieler nicht reagiert hat.",
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: "DANGER",
      oButtonStyle: "PRIMARY",
      turnMessage: "{emoji} | Der Spieler **{player}** ist an der Reihe .",
      winMessage: "{emoji} | **{player}** hat das TicTacToe-Spiel gewonnen.",
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
