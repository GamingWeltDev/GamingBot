module.exports = {
  client: {
    token: "<PRIVAT>",
    id: "<PRIVAT>",
  },
  handler: {
    prefix: "?",
    deploy: true,
    commands: {
      prefix: true,
      slash: true,
      user: true,
      message: true,
    },
    mongodb: {
      uri: "<PRIVAT>",
      toggle: true,
    },
  },
  users: {
    developers: ["599494596598431765", "868972288001863730"],
    giveawayperm: "1188886140502155384",
    modperm: "1189257998221185135"
  },
  development: {
    enabled: false,
    guild: "<PRIVAT>",
  },
  messageSettings: {
    nsfwMessage: "Der aktuelle Kanal ist kein NSFW-Kanal.",
    developerMessage: "Sie sind nicht berechtigt, diesen Befehl zu verwenden.",
    cooldownMessage:
      "Langsam, Kumpel! Du bist zu schnell, um diesen Befehl zu benutzen.",
    globalCooldownMessage:
      "Langsam, Kumpel! Dieser Befehl hat eine globale Abklingzeit.",
    notHasPermissionMessage:
      "Sie haben nicht die Berechtigung, diesen Befehl zu verwenden.",
    notHasPermissionComponent:
      "Sie haben nicht die Erlaubnis, diese Komponente zu verwenden.",
    missingDevIDsMessage:
      "Dieser Befehl ist nur für Entwickler gedacht, kann aber aufgrund fehlender Benutzer-IDs in der Konfigurationsdatei nicht ausgeführt werden.",
  },
};
