const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const counting = require("../../../schemas/countingSchema");
const ExtendedClient = require("../../../class/ExtendedClient");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("counting")
    .setDescription("Verwalten des Counting Systems")
    .setDMPermission(false)
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Setup des Counting Systemes")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Der Kanal für das Counting System")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        ),
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Deaktivieren des Counting Systemes"),
    ),
  options: {
    developers: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction<true>} interaction
   */
  run: async (client, interaction, args) => {
    const { options } = interaction;
    const sub = options.getSubcommand();
    const data = await counting.findOne({ guildId: interaction.guild.id });

    switch (sub) {
      case "setup":
        if (data) {
          return await interaction.reply({
            content:
              "Sie haben bereits das **Counting System** hier gesetupped!",
            ephemeral: true,
          });
        } else {
          const channel = options.getChannel("channel");
          await counting.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
            Number: 1,
          });

          const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `⌚ Das Couting System wurde erfolgreich gesetupped! \n \n Kanal: ${channel}`,
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        break;
      case "disable":
        if (!data) {
          return await interaction.reply({
            content:
              "Sie haben noch nicht das **Counting System** hier gesetupped!",
            ephemeral: true,
          });
        } else {
          await counting.deleteOne({
            Guild: interaction.guild.id,
          });

          const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(
              `❌ Das Couting System wurde erfolgreich deaktiviert! \n \n Kanal: ${channel}`,
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        break;
    }
  },
};
