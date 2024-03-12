const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { log } = require("../../../functions")
const createBuilder = require('discord-command-builder')

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('developer')
        .setDescription('Tools für die Bot Devs')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((command) => command
          .setName('eval')
          .setDescription('Ausführen einiger Codes')
          .addStringOption((option) =>
            option
              .setName("code")
              .setDescription("Der auszuführende Code.")
              .setRequired(true)))
        .addSubcommand((command) => command
          .setName('emit-event')
          .setDescription('Senden Sie ein Ereignis an den Client')
          .addStringOption((option) =>
            option
              .setName("event")
              .setDescription("Welches Ereignis möchten Sie senden?")
              .addChoices(
                { name: "guildMemberAdd", value: "guildMemberAdd" },
                { name: "guildMemberRemove", value: "guildMemberRemove" },
                { name: "guildMemberUpdate", value: "guildMemberUpdate" },
              )
              .setRequired(true)))
        .addSubcommand((command) => command
          .setName('status')
          .setDescription('Setzt den Bot Status')
          .addStringOption((option) =>
            option
              .setName("status")
              .setDescription("Der Status, den Sie als Anwesenheit des Bots möchten")
              .setMaxLength(128)
              .setRequired(true))
          .addStringOption((option) =>
            option
              .setName("type")
              .setDescription("Die Art des Status, den der Bot haben soll")
              .addChoices(
                { name: "Schaut", value: `${4}` },
                { name: "Spielt", value: `${1}` },
                { name: "Hort ... zu", value: `${3}` },
                { name: "Tritt an in", value: `${6}` },
                { name: "Streamt", value: `${2}` },
              )
              .setRequired(true)))
        .addSubcommand((command) => command
          .setName('generate-command')
          .setDescription('Generiere einen Befehl'))
        .addSubcommand((command) => command
          .setName('shutdown')
          .setDescription('Fahre den Bot herunter')),
    options: {
      developers: true,
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
      const { options, member } = interaction;

      const sub = options.getSubcommand();

      switch (sub) {
        case 'eval':
          await interaction.deferReply();

          var code = interaction.options.getString("code");
          
          try {
            let executedEvalValue = eval(code);

            if (typeof executedEvalValue !== "string")
              executedEvalValue = require("util").inspect(executedEvalValue);

            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Code ausgeführt")
                  .setDescription(
                    `Der Code wurde erfolgreich ausgeführt, es wurden keine Fehler gefunden.`,
                  )
                  .setColor("Green"),
              ],
              files: [
                new AttachmentBuilder(
                  Buffer.from(
                    `${executedEvalValue}`.replace(
                      new RegExp(`${client.token}`, "g"),
                      '"[CLIENT TOKEN VERSTECKT]"',
                    ),
                    "utf-8",
                  ),
                  { name: "output.javascript" },
                ),
              ],
            });
          } catch (err) {
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Fehler")
                  .setDescription(
                    `Bei der Ausführung Ihres Codes ist etwas schief gelaufen.`,
                  )
                  .setColor("Red"),
              ],
              files: [
                new AttachmentBuilder(Buffer.from(`${err}`, "utf-8"), {
                  name: "output.txt",
                }),
              ],
            });
          }
          
          break;
        case 'emit-event':
           const event = options.getString("event")
          
            switch (event) {
              case 'guildMemberAdd':
                client.emit("guildMemberAdd", member);
                break;
              case 'guildMemberRemove':
                client.emit("guildMemberRemove", member);
                break;
              case 'guildMemberUpdate':
                client.emit('guildMemberUpdate', member, member);
                break;
              default:
                interaction.reply({ content: `Ungültiges Ereignis`, ephemeral: true })
                break;
            }

            interaction.reply({ content: `Ereignis \`${event}\` wurde gesendet.`, ephemeral: true })
          
          break;

        case 'status':
          const status = options.getString("status");
          const type = options.getString("type");

          client.user.setActivity({
            name: status,
            type: type - 1,
            url: "https://www.twitch.tv/discord",
            state: "Gesetzer Status eines Devs",
          });

          const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Der Status des Bottes wurde erfolgreich geändert")
            .setDescription(
              `:white_check_mark: Der Status des **Bottes** ist nun \`${status}\`, mit dem typ: ${
                type - 1
              }`,
            );

          await interaction.reply({ embeds: [embed], ephemeral: true });
          
          break;
        case 'generate-command':
          createBuilder({ interaction: interaction, path: './cache/' }).catch(async err => {
            return await interaction.reply({ content: `🌍 Es ist ein Fehler aufgetreten während dem ausführen des Befehles.`, ephemeral: true });
          })
          
          break;
        case 'shutdown':
          const embed1 = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`🛠️ Der Bot wurde heruntergefahren!\nDer Bot startet automatisch in **ca. 3 Minuten**, sollte er dies nicht tun bitte klicke auf Folgenden Link: [Bot Starten](https://gamingbot--ooalmaxoo.repl.co/)`)

          log(`Der Bot wird heruntergefahren...`, 'warn')

          await interaction.reply({ content: `🚧 Der Bot wird heruntergefahren...`, ephemeral: true });
          client.user.setStatus('invisible');

          setTimeout(async () => {
            await interaction.editReply({ content: ``, embeds: [embed1] });

            log(`Der Bot wurde heruntergefahren von ${interaction.member.id}.`, 'err')

            process.exit();
          }, 2000)
          
          break;
      }
    }
};
