const { REST, Routes } = require("discord.js");
const { log } = require("../functions");
const config = require("../config");
const ExtendedClient = require("../class/ExtendedClient");

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client) => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.CLIENT_TOKEN || config.client.token
  );

  try {
    log(
      "Startet das Laden von Anwendungsbefehlen... (das kann Minuten dauern!)",
      "info"
    );

    function isSnowflake(id) {
      return /^\d+$/.test(id);
  }
  
  const guildId = process.env.GUILD_ID || config.development.guild;
  
  if (!isSnowflake(guildId)) {
      log("Die Gilden-ID fehlt. Bitte setzen Sie diese in der .env oder config Datei oder deaktivieren Sie die Entwicklung in der config", "err");
      return; 
  }
    
    if (config.development && config.development.enabled) {
      await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID || config.client.id, guildId),
          {
              body: client.applicationcommandsArray,
          }
      );
      log(`Erfolgreich Anwendungsbefehle in die Gilde ${guildId} geladen.`, "done");
    } else { 
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID || config.client.id),
        {
          body: client.applicationcommandsArray,
        }
      );
      log("Die Anwendungsbefehle wurden erfolgreich global in die Discord-API geladen.", "done");
    }
  } catch (e) {
    log(`Anwendungsbefehle können nicht in die Discord-API geladen werden: ${e.message}`, "err");
  }
};
