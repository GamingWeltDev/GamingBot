const { readdirSync } = require('fs');
const { log } = require('../functions');
const ExtendedClient = require('../class/ExtendedClient');

/**
 * 
 * @param {ExtendedClient} client 
 */
module.exports = (client) => {
    for (const dir of readdirSync('./src/components/')) {
        for (const file of readdirSync('./src/components/' + dir).filter((f) => f.endsWith('.js'))) {
            const module = require('../components/' + dir + '/' + file);

            if (!module) continue;
            if (dir === 'buttons') {
                if (!module.customId || !module.run) {
                    log('Die Komponente kann nicht geladen werden ' + file + ', da die Eigenschaften \'structure#customId\' oder/und \'run\' fehlen.', 'warn');

                    continue;
                };

                client.collection.components.buttons.set(module.customId, module);
            } else if (dir === 'selects') {
                if (!module.customId || !module.run) {
                    log('Das Auswahlmenü kann nicht geladen werden ' + file + ', da die Eigenschaften \'structure#customId\' oder/und \'run\' fehlen.', 'warn');

                    continue;
                };

                client.collection.components.selects.set(module.customId, module);
            } else if (dir === 'modals') {
                if (!module.customId || !module.run) {
                    log('Das Modal ' + file + ' kann nicht geladen werden, da die Eigenschaften \'structure#customId\' oder/und \'run\' fehlen.', 'warn');

                    continue;
                };

              client.collection.components.modals.set(module.customId, module);
              
              log(`Neue Modal-Komponente geladen: ${file}`, 'info');
            } else if (dir === 'autocomplete') {
                if (!module.commandName || !module.run) {
                    log(`Die Autovervollständigungskomponente ${file} kann nicht geladen werden, da die Eigenschaften 'commandName' oder 'run' fehlen.`, 'warn');
                    continue;
                }
                
                client.collection.components.autocomplete.set(module.commandName, module);
                
                log(`Neue Autocomplete-Komponente geladen: ${file}`, 'info');
            } else {
                log(`Ungültiger Komponententyp: ${file}`, 'warn');
            }
        }
    }
};
