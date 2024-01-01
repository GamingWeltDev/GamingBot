const { readdirSync } = require("fs");
const { log } = require("../functions");
const ExtendedClient = require("../class/ExtendedClient");

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = (client) => {
  for (const type of readdirSync("./src/commands/")) {
    for (const dir of readdirSync("./src/commands/" + type)) {
      for (const file of readdirSync(
        "./src/commands/" + type + "/" + dir,
      ).filter((f) => f.endsWith(".js"))) {
        const module = require("../commands/" + type + "/" + dir + "/" + file);

        if (!module) continue;

        if (type === "prefix") {
          if (!module.structure?.name || !module.run) {
            log(
              "Der Befehl " +
                file +
                " konnte nicht geladen werden, weil 'structure#name' oder/und 'Ausführungseigenschaften' fehlen.",
              "warn",
            );

            continue;
          }

          client.collection.prefixcommands.set(module.structure.name, module);

          if (
            module.structure.aliases &&
            Array.isArray(module.structure.aliases)
          ) {
            module.structure.aliases.forEach((alias) => {
              client.collection.aliases.set(alias, module.structure.name);
            });
          }
        } else {
          if (!module.structure?.name || !module.run) {
            log(
              "Der Befehl " +
                file +
                " konnte nicht geladen werden, weil 'structure#name' oder/und 'Ausführungseigenschaften' fehlen.",
              "warn",
            );

            continue;
          }

          client.collection.interactioncommands.set(
            module.structure.name,
            module,
          );
          client.applicationcommandsArray.push(module.structure);
        }

        log("Neuer Befehl Geladen: " + file, "info");
      }
    }
  }
};
