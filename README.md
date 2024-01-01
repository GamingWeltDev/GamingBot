[![discord](https://img.shields.io/discord/1172894758553788466?label=Discord)](https://discord.gg/4B8R4GhU9t)
[![npm-version](https://img.shields.io/npm/v/npm.svg?logo=npm)](https://github.com/npm/cli)

# 🤖 GamingBot
Der GamingBot ist ein Projekt, das auf [GamingWelts Discord Server](https://discord.gg/4B8R4GhU9t) läuft. Er wird ständig verbessert und erweitert. Wenn du Lust hast, dich daran zu beteiligen, schau dir bitte zuerst die `README.md` Datei an. Dort findest du alle wichtigen Informationen.

# 💻 Hosting
Der GamingBot ist auf eine Infrastruktur angewiesen, um zu laufen. Wenn du ihn verwenden möchtest, brauchst du eine MongoDB Datenbank. Es wird angenommen, dass du schon eine hast.

Der GamingBot ist in der Programmiersprache JavaScript geschrieben. Du benötigt zum Ausführen also [Node.js](https://nodejs.org/en/download)

Zum Starten benötigst du 2 Dateien:
- `src/config.js`
- `.env`

Die `src/config.js` Datei ist in den Projektdatein bereits da, aber die `.env` musst du selber erstellen.

# 🔒 .env
```.env
CLIENT_ID=
GUILD_ID=
MONGODB_URI=
CLIENT_TOKEN=
```

# 🏡 Entwicklungsumgebung
Als Entwicklungsumgebung (IDE) **empfehlen** wir Visual Studio Code. Andere IDE's funktionieren im Normalfall auch.

Um das Github Projekt (GamingBot) zu nutzen, müsst ihr es zuerst auf euren PC herunterladen. Dann öffnet ihr eine Eingabeaufforderung (cmd) in dem entsprechenden Ordner und tippt `node .` ein, um den Bot zu aktivieren.

# 🧱 Struktur
Der Code des Bots hat eine klare Struktur. Dafür gibt es 8 Haupt-Packages:
- `src/class` - Die Hauptklassen von dem Bot.
- `src/commands` - Für die Befehle zuständig.
- `src/components` - Für die Komponenten zuständig zum Beispiel Buttons.
- `src/events` - Für die Guild(Server)/Client Events zuständig.
- `src/handlers` - Dafür zuständig das Befhele, Komponenten und Events geladen werden.
- `src/schemas` - Für die Datenbank.
- `src/config.js` - Für die Konfiguration des Bots.
- `src/functions.js` - Hauptfunktionen.
- `src/index.js` - Start Datei

# 🚧 Befehle
Jeder Befehl hat seine eigene Datei im Package der entsprechenden Funktion.

## Prefix Befehle
Wird mit **!** oder einen Beliebigen Prefix benutzt.
```js
const { Message, PermissionFlagBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: {
        name: '',
        description: '',
        aliases: [],
        permissions: null
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message, args) => {
        
    }
};
```

## Slash Befehle
Wird mit **/** benutzt.
```js
const { ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('')
        .setDescription(''),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

    }
};
```

## Apps Befehle
Halte auf eine Nachricht oder einen Nutzer gedrückt (Mobile) oder Rechtsklicke einen Nutzer oder eine Nachricht (PC) und fühere einen Befehls aus.

### Nutzer
```js
const { UserContextMenuCommandInteraction, ContextMenuCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new ContextMenuCommandBuilder()
        .setName('')
        .setType(2),
    /**
     * @param {ExtendedClient} client 
     * @param {UserContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

    }
};
```

### Nachricht
```js
const { MessageContextMenuCommandInteraction, ContextMenuCommandBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');

module.exports = {
    structure: new ContextMenuCommandBuilder()
        .setName('')
        .setType(3),
    /**
     * @param {ExtendedClient} client 
     * @param {MessageContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

    }
};
```
# 🗄️ Datenbank
Für Zugriffe auf die Datenbank verwenden wir [mongoose](https://mongoosejs.com/). Es folgt eine kurze Erklärung für das Wichtigste.

## Schemas
Über Schemas ist es einfacher zu kontrollieren ob etwas einen Daten eintrag hat, oder einen Dateneintrag zu setzen, verwalten oder löschen.

Beispiel für ein Schema
```js
const { model, Schema } = require('mongoose');

module.exports = model('countingSchema',
    new Schema({
      Guild: String,
      Channel: String,
      Number: Number,
      LastUser: String,
    })
);
```

Beispiel für die Verwendung eines Schemas
```js
// ...
const counting = require("../../../schemas/countingSchema");
// ...
const data = await counting.findOne({ guildId: interaction.guild.id });
// ...
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
  })
  const embed = new EmbedBuilder()
    .setColor("Blurple")
    .setDescription(
      `⌚ Das Couting System wurde erfolgreich gesetupped! \n \n Kanal: ${channel}`,
    )
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
// ...
await counting.deleteOne({
  Guild: interaction.guild.id,
});
// ...
```
