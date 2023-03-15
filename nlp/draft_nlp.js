const { NlpManager } = require("node-nlp");
const { parse } = require("csv-parse");
const fs = require("fs");

const MODEL_FILENAME = "model.nlp";

const manager = new NlpManager({ languages: ["en"] });

fs.createReadStream("training_data.csv")
  .pipe(parse({ columns: true }))
  .on("data", (row) => {
    const url = row.url;
    const label = row.label;

    if (url && label) {
      const urlLower = url.toLowerCase().trim();
      const labelLower = label.toLowerCase().trim();

      manager.addDocument("en", urlLower, labelLower);
    }
  })
  .on("end", () => {
    manager.train();
    manager.save(MODEL_FILENAME);

    const urlsToTest = [
      "example.com",
      "badexample.com",
      "phishingexample.com",
      "discord.com",
      "disord.ru",
      "twitch-global.com",
    ];

    urlsToTest.forEach(async (url) => {
      // const tokens = url.split(/[\s/.]+/).filter((x) => x);
      const { classifications } = await manager.process("en", url);
      const intent = classifications.find((c) => c.intent !== "None");
      console.log(`${url} - intent: ${intent ? intent.intent : "None"}`);
    });
  });
