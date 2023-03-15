const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: false } });

// Adds the utterances and intents for the NLP
manager.addDocument('en', 'google.com', 'url.safe');
manager.addDocument('en', 'twitter.com', 'url.safe');
manager.addDocument('en', 'instagram.com', 'url.safe');
manager.addDocument('en', 'discord.com', 'url.safe');

manager.addDocument('en', 'https://discord.gg/wGp8TpDjby', 'url.phishing');
manager.addDocument('en', 'https://discord.gg/e-sexies', 'url.phishing');
manager.addDocument('en', 'https://discord.gg/uhaNEBYZBP', 'url.phishing');
manager.addDocument('en', 'https://discord.gg/QKuCFK4G', 'url.phishing');

// Train also the NLG
manager.addAnswer('en', 'url.phishing', 'true');
manager.addAnswer('en', 'url.safe', 'false');

// Train and save the model.
(async() => {
    await manager.train();
    manager.save();
    const response = await manager.process('en', 'abcde.gg');
    console.log(response);
})();