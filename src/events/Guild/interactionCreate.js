const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");

const cooldown = new Map();

module.exports = {
  event: "interactionCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (client, interaction) => {
    if (!interaction.isCommand()) return;

    if (
      config.handler.commands.slash === false &&
      interaction.isChatInputCommand()
    )
      return;
    if (
      config.handler.commands.user === false &&
      interaction.isUserContextMenuCommand()
    )
      return;
    if (
      config.handler.commands.message === false &&
      interaction.isMessageContextMenuCommand()
    )
      return;

    const command = client.collection.interactioncommands.get(
      interaction.commandName
    );

    if (!command) return;

    try {
      if (command.options?.developers) {
        if (
          config.users?.developers?.length > 0 &&
          !config.users?.developers?.includes(interaction.user.id)
        ) {
          await interaction.reply({
            content:
              config.messageSettings.developerMessage !== undefined &&
              config.messageSettings.developerMessage !== null &&
              config.messageSettings.developerMessage !== ""
                ? config.messageSettings.developerMessage
                : "Sie sind nicht berechtigt, diesen Befehl zu verwenden",
            ephemeral: true,
          });

          return;
        } else if (config.users?.developers?.length <= 0) {
          await interaction.reply({
            content:
              config.messageSettings.missingDevIDsMessage !== undefined &&
              config.messageSettings.missingDevIDsMessage !== null &&
              config.messageSettings.missingDevIDsMessage !== ""
                ? config.messageSettings.missingDevIDsMessage
                : "Dieser Befehl ist nur für Entwickler gedacht, kann aber aufgrund fehlender Benutzer-IDs in der Konfigurationsdatei nicht ausgeführt werden.",

            ephemeral: true,
          });

          return;
        }
      }

      if (command.options?.nsfw && !interaction.channel.nsfw) {
        await interaction.reply({
          content:
            config.messageSettings.nsfwMessage !== undefined &&
            config.messageSettings.nsfwMessage !== null &&
            config.messageSettings.nsfwMessage !== ""
              ? config.messageSettings.nsfwMessage
              : "Der aktuelle Kanal ist kein NSFW-Kanal",

          ephemeral: true,
        });

        return;
      }
      const mainGuild = client.guilds.cache.get('1172894758553788466')
      const mainGuildMember = mainGuild.members.cache.get(interaction.user.id);
      
      if (command.options?.giveaway) {
        if (config.users?.giveawayperm?.length > 0) {
          if (!mainGuildMember.roles.cache.has(config.users?.giveawayperm)) {
            await interaction.reply({
              content:
                config.messageSettings.notHasPermissionMessage !== undefined &&
                config.messageSettings.notHasPermissionMessage !== null &&
                config.messageSettings.notHasPermissionMessage !== ""
                  ? config.messageSettings.notHasPermissionMessage
                  : "Sie sind nicht berechtigt, diesen Befehl zu verwenden",
              ephemeral: true,
            });

            return;
          }
        }
      }

      if (command.options?.modcommand) {
        if (config.users?.modperm?.length > 0) {
          if (!mainGuildMember.roles.cache.has(config.users?.modperm)) {
            await interaction.reply({
              content:
                config.messageSettings.notHasPermissionMessage !== undefined &&
                config.messageSettings.notHasPermissionMessage !== null &&
                config.messageSettings.notHasPermissionMessage !== ""
                  ? config.messageSettings.notHasPermissionMessage
                  : "Sie sind nicht berechtigt, diesen Befehl zu verwenden",
              ephemeral: true,
            });

            return;
          }
        }
      }

      if (command.options?.cooldown) {
        const isGlobalCooldown = command.options.globalCooldown;
        const cooldownKey = isGlobalCooldown ? 'global_' + command.structure.name : interaction.user.id;
        const cooldownFunction = () => {
          let data = cooldown.get(cooldownKey);

          data.push(interaction.commandName);

          cooldown.set(cooldownKey, data);

          setTimeout(() => {
            let data = cooldown.get(cooldownKey);

            data = data.filter((v) => v !== interaction.commandName);

            if (data.length <= 0) {
              cooldown.delete(cooldownKey);
            } else {
              cooldown.set(cooldownKey, data);
            }
          }, command.options.cooldown);
        };

        if (cooldown.has(cooldownKey)) {
          let data = cooldown.get(cooldownKey);

          if (data.some((v) => v === interaction.commandName)) {
            const cooldownMessage = isGlobalCooldown 
              ? config.messageSettings.globalCooldownMessage ?? "Langsam, Kumpel! Dieser Befehl hat eine globale Abklingzeit"
              : config.messageSettings.cooldownMessage ?? "Langsam, Kumpel! Du bist zu schnell für diesen Befehl";

            await interaction.reply({
              content: cooldownMessage,
              ephemeral: true,
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(cooldownKey, [interaction.commandName]);
          cooldownFunction();
        }
      }

      command.run(client, interaction);
    } catch (error) {
      log(error, "err");
    }
  },
};