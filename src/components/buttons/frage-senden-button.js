const { ButtonInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

module.exports = {
  customId: "fragesenden",
  /**
   *
   * @param {ExtendedClient} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const firstEmbed = interaction.message.embeds[0];

    const oldreactions = await interaction.message.reactions.cache 

    interaction.reply({
      content: "Du hast deine Frage erfolgreich gesendet.",
      ephemeral: true,
    })
    
    const embed = new EmbedBuilder(firstEmbed)
      .setTitle("Neue Frage")
      .setFooter({ text: "Möchtest du eine Frage senden? Drücke auf den Button unten oder gebe /frage_einreichen ein."})

    const confirm = new ButtonBuilder()
      .setCustomId('frageeinreichenbtn')
      .setLabel('Frage Einreichen')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder()
      .addComponents(confirm);
    
    const frChannel = interaction.guild.channels.cache.get(
      "1187412414036201493",
    );
    const message = await frChannel.send({
      content: "<@&1187805853785542736>",
      embeds: [embed],
      components: [row]
    });
    
    oldreactions.forEach((reaction) => {
      message.react(reaction.emoji)
    });
    
    const thread = await message.startThread({
      name: "Unterhaltet euch über diese Frage!",
      autoArchiveDuration: 1440,
    });

    await thread.send(
      `Willkommen im Thread! Hier können wir uns über die Frage unterhalten.`,
    );
  },
};
