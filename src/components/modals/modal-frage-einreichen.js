const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

const emojis = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇶",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿",
];

module.exports = {
  customId: "frageeinreichen",
  /**
   *
   * @param {ExtendedClient} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    const frageInput = interaction.fields.getTextInputValue("frage");
    const auswahlmoeglichkeitenInput =
      interaction.fields.getTextInputValue("auswahl");

    const result = auswahlmoeglichkeitenInput.split(/\r?\n/);

    const letterOptions = result.map(
      (option, index) => `${emojis[index]}: ${option}`,
    );

    const letterOptionsWithNewLine = letterOptions.join('\n');

    await interaction.reply({
      content: `Du hast deine **Frage** erfolgreich zur Moderation gesendet.`,
      ephemeral: true,
    });

    const confirm = new ButtonBuilder()
      .setCustomId('fragesenden')
      .setLabel('Frage Senden')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(confirm);
    
    const embed = new EmbedBuilder()
      .setTitle(`[VORSCHAU] Fragerunde`)
      .setDescription(
        `Einen Wunderschönen, hier ist <@${interaction.user.id}> 👋\n\nHeute würde ich gerne wissen, ${frageInput}\n\n**Auswahlmöglichkeiten:**\n${letterOptionsWithNewLine}`,
      );

    const modChannel = interaction.guild.channels.cache.get(
      "1187770433970376714",
    );
    const frageMessage = await modChannel.send({
      content: "Neue Einreichung für eine Frage",
      embeds: [embed],
      components: [row],
    });

    for (let i = 0; i < Math.min(result.length, 26); i++) {
      await frageMessage.react(emojis[i]);
    }

    const thread = await frageMessage.startThread({
      name: "Unterhaltet euch über diese Frage!",
      autoArchiveDuration: 60,
    });

    await thread.send(
      `Willkommen im Thread! Hier können wir uns über die Frage "${frageInput}" unterhalten.`,
    );
  },
};
