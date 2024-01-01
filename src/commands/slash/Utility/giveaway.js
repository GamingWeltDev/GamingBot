const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ExtendedClient = require("../../../class/ExtendedClient");
const ms = require("ms");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription(
      "Starten Sie ein Gewinnspiel oder konfigurieren Sie ein bestehendes Gewinnspiel",
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((command) =>
      command
        .setName("start")
        .setDescription("Startet ein Gewinnspiel")
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Die Dauer des Gewinnspieles (z.B 1m, 1d, 1h, etc)")
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("Die Anzahl der Gewinner (In Zahlen)")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("Der Preis des Gewinnspieles")
            .setRequired(true),
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Der Kanal, wo das Gewinnspiel statt findet")
            .setRequired(false),
        )
        .addStringOption((option) =>
          option
            .setName("content")
            .setDescription("Der Inhalt des Embeds")
            .setRequired(false),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("edit")
        .setDescription("Bearbeitet ein Gewinnspiel")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("Die ID des Gewinnspieles")
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("time")
            .setDescription(
              "Die Dauer des Gewinnspieles die hinzugefügt werden soll in MS",
            )
            .setRequired(true),
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription(
              "Die Aktuallisierte Anzahl der Gewinner (In Zahlen)",
            )
            .setRequired(true),
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("Der Aktuallisierte Preis des Gewinnspieles")
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("end")
        .setDescription("Beendet ein Gewinnspiel")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("Die ID des Gewinnspieles")
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("reroll")
        .setDescription("Wählt neue Gewinner aus")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("Die ID des Gewinnspieles")
            .setRequired(true),
        ),
    ),
  options: {
    giveaway: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "start":
        await interaction.reply({
          content: "Dein Gewinnspiel wird gestartet...",
          ephemeral: true,
        });

        const duration = ms(interaction.options.getString("duration") || "");
        const winnerCount = interaction.options.getInteger("winners");
        const prize = interaction.options.getString("prize");
        const contentMain = interaction.options.getString("content");
        const channel = interaction.options.getChannel("channel");
        const showChannel =
          interaction.options.getChannel("channel") || interaction.channel;

        if (!channel && !contentMain)
          client.giveawaysManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: false,
              content: contentMain,
              threshold: 60000000000_000,
              embedColor: `#0000ff`,
            },
            messages: {
              giveaway: "🎉🎉 **GEWINNSPIEL** 🎉🎉",
              giveawayEnded: "🎉🎉 **GEWINNSPIEL BEENDET** 🎉🎉",
              title: "{this.prize}",
              drawing: "Auflösung: {timestamp}",
              dropMessage: "Seien Sie der Erste, der mit 🎉 reagiert!",
              inviteToParticipate: "Reagieren Sie mit 🎉 um teilzunehmen!",
              winMessage:
                "Herzlichen Glückwunsch, {winners}! Gewinn: **{this.prize}**!\n{this.messageURL}",
              embedFooter: "{this.winnerCount} Gewinner",
              noWinner: "Gewinnspiel abgebrochen, keine gültigen Teilnahmen.",
              hostedBy: "Veranstaltet von: {this.hostedBy}",
              winners: "Gewinner:",
              endedAt: "Beendet am",
            },
          });
        else if (!channel)
          client.giveawaysManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: true,
              content: contentMain,
              threshold: 60000000000_000,
              embedColor: `#0000ff`,
            },
            messages: {
              giveaway: "🎉🎉 **GEWINNSPIEL** 🎉🎉",
              giveawayEnded: "🎉🎉 **GEWINNSPIEL BEENDET** 🎉🎉",
              title: "{this.prize}",
              drawing: "Auflösung: {timestamp}",
              dropMessage: "Seien Sie der Erste, der mit 🎉 reagiert!",
              inviteToParticipate: "Reagieren Sie mit 🎉 um teilzunehmen!",
              winMessage:
                "Herzlichen Glückwunsch, {winners}! Gewinn: **{this.prize}**!\n{this.messageURL}",
              embedFooter: "{this.winnerCount} Gewinner",
              noWinner: "Gewinnspiel abgebrochen, keine gültigen Teilnahmen.",
              hostedBy: "Veranstaltet von: {this.hostedBy}",
              winners: "Gewinner:",
              endedAt: "Beendet am",
            },
          });
        else if (!contentMain)
          client.giveawaysManager.start(channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: false,
              content: contentMain,
              threshold: 60000000000_000,
              embedColor: `#0000ff`,
            },
            messages: {
              giveaway: "🎉🎉 **GEWINNSPIEL** 🎉🎉",
              giveawayEnded: "🎉🎉 **GEWINNSPIEL BEENDET** 🎉🎉",
              title: "{this.prize}",
              drawing: "Auflösung: {timestamp}",
              dropMessage: "Seien Sie der Erste, der mit 🎉 reagiert!",
              inviteToParticipate: "Reagieren Sie mit 🎉 um teilzunehmen!",
              winMessage:
                "Herzlichen Glückwunsch, {winners}! Gewinn: **{this.prize}**!\n{this.messageURL}",
              embedFooter: "{this.winnerCount} Gewinner",
              noWinner: "Gewinnspiel abgebrochen, keine gültigen Teilnahmen.",
              hostedBy: "Veranstaltet von: {this.hostedBy}",
              winners: "Gewinner:",
              endedAt: "Beendet am",
            },
          });
        else
          client.giveawaysManager.start(channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            lastChance: {
              enabled: true,
              content: contentMain,
              threshold: 60000000000_000,
              embedColor: `#0000ff`,
            },
            messages: {
              giveaway: "🎉🎉 **GEWINNSPIEL** 🎉🎉",
              giveawayEnded: "🎉🎉 **GEWINNSPIEL BEENDET** 🎉🎉",
              title: "{this.prize}",
              drawing: "Auflösung: {timestamp}",
              dropMessage: "Seien Sie der Erste, der mit 🎉 reagiert!",
              inviteToParticipate: "Reagieren Sie mit 🎉 um teilzunehmen!",
              winMessage:
                "Herzlichen Glückwunsch, {winners}! Gewinn: **{this.prize}**!\n{this.messageURL}",
              embedFooter: "{this.winnerCount} Gewinner",
              noWinner: "Gewinnspiel abgebrochen, keine gültigen Teilnahmen.",
              hostedBy: "Veranstaltet von: {this.hostedBy}",
              winners: "Gewinner:",
              endedAt: "Beendet am",
            },
          });

        interaction.editReply({
          content: "Dein Gewinnspiel wurde gestartet!",
          ephemeral: true,
        });

        break;
      case "edit":
        await interaction.reply({
          content: "Dein Gewinnspiel wird bearbeitet...",
          ephemeral: true,
        });

        const newprize = interaction.options.getString("prize");
        const newduration = interaction.options.getString("time");
        const newwinners = interaction.options.getInteger("winners");
        const messageId = interaction.options.getString("message-id");

        client.giveawaysManager
          .edit(messageId, {
            addTime: ms(newduration),
            newWinnerCount: newwinners,
            newPrize: newprize,
          })
          .then(() => {
            interaction.editReply({
              content: "Dein Gewinnspiel wurde bearbeitet.",
              ephemeral: true,
            });
          })
          .catch((err) => {
            interaction.editReply({
              content:
                "Es ist ein Fehler aufgetreten bei dem bearbeitet deines Gewinnspieles.",
              ephemeral: true,
            });
          });

        break;
      case "end":
        await interaction.reply({
          content: "Dein Gewinnspiel wird beendet...",
          ephemeral: true,
        });

        const messageId1 = interaction.options.getString("message-id");

        client.giveawaysManager
          .end(messageId1)
          .then(() => {
            interaction.editReply({
              content: "Dein Gewinnspiel wurde beendet.",
              ephemeral: true,
            });
          })
          .catch((err) => {
            interaction.editReply({
              content:
                "Es ist ein Fehler aufgetreten bei dem beenden deines Gewinnspieles.",
              ephemeral: true,
            });
          });

        break;
      case "reroll":
        await interaction.reply({
          content: "TROMMELWIRBEL... Ein neuer Gewinner wird nun ausgewählt...",
          ephemeral: true,
        });

        const query = interaction.options.getString(`message-id`);
        const giveaway =
          client.giveawaysManager.giveaways.find(
            (g) => g.guildId === interaction.guildId && g.prize === query,
          ) ||
          client.giveawaysManager.giveaways.find(
            (g) => g.guildId === interaction.guildId && g.messageId === query,
          );

        if (!giveaway)
          return interaction.editReply({
            content:
              "Ich konnte kein Gewinnspiel mit der angegebenen ID gefunden.",
            ephemeral: true,
          });
        const messageId2 = interaction.options.getString(`message-id`);
        client.giveawaysManager
          .reroll(messageId2)
          .then(() => {
            interaction.editReply({
              content: "Yuhu! Ein neuer Gewinner wurde ausgewählt.",
              ephemeral: true,
            });
          })
          .catch((err) => {
            interaction.editReply({
              content:
                "Es ist ein Fehler aufgetreten bei dem neuauswählens des neuens gewinners deines Gewinnspieles.",
              ephemeral: true,
            });
          });

        break;
    }
  },
};
