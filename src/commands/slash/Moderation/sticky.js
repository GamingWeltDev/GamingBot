const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const stickySchema = require("../../../schemas/stickySchema");
const ExtendedClient = require("../../../class/ExtendedClient");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("sticky")
    .setDescription("Benutze diesen Befehl für die Verwaltung von Sticky-Nachrichten")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(command => command
      .setName("create")
      .setDescription("Erstellt eine Sticky-Nachricht")
      .addStringOption(option => option.setName('message').setDescription("Die Nachricht, die als Sticky-Nachricht erzeugt werden soll").setRequired(true))
      .addNumberOption(option => option.setName('count').setDescription("Wie frequent, soll die Nachricht reingesendet werden soll")))
    .addSubcommand(command => command
      .setName("delete")
      .setDescription("Entfernt eine Sticky-Nachricht"))
    .setDMPermission(false),
  options: {
    developers: true,
  },
  /**
   * @param {ExtendedClient} client
   * @param {ChatInputCommandInteraction<true>} interaction
   */
  run: async (client, interaction, args) => {
    const { options } = interaction;

    let sub = options.getSubcommand()

    switch (sub) {
      case "create":
        let string = options.getString('message');
        let amount = options.getNumber('count') || 6;
        
        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(string);

        const data = await stickySchema.findOne({ Guild: interaction.guild.id });

        let msg = await interaction.channel.send({ embeds: [embed] });
        
        if (!data) {
          stickySchema.create({
            ChannelID: interaction.channel.id,
            Message: string,
            MaxCount: amount,
            LastMessageID: msg.id,
          })
        } else {
          await interaction.reply({ content: "Du hast bereits eine Sticky-Nachricht in diesem Channel eingerichtet. Bitte entferne sie mit **/sticky delete** und versuche es dann erneut", ephemeral: true})
        }

        break;
      case "delete":
        const data1 = await stickySchema.findOne({ ChannelID: interaction.channel.id });

        if (!data1) {
          return await interaction.reply({ content: `In diesem Kanal ist keine Sticky-Nachricht eingerichtet.`, ephemeral: true })
        } else {
          try {
            await interaction.client.channels.get(data1.ChannelID).messages.fetch(data1.LastMessageID).then(async(m) => {
              await m.delete();
            });
          } catch {
            return await interaction.reply({ content: `⚠️ Der Befehl konnte nicht ausgeführt werden.`, ephemeral: true });
          }
        }

        await stickySchema.deleteMany({ ChannelID: interaction.channel.id })

        return await interaction.reply({ content: "Die Sticky-Nachricht wurde erfolgreich gelöscht.", ephemeral: true });
        
        break;
    }
  },
};
