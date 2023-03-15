const { NlpManager } = require('node-nlp');
const { parse } = require('csv-parse');
const fs = require('fs');

const manager = new NlpManager({ languages: ['en'] });

fs.createReadStream('training_data.csv')
  .pipe(parse())
  .on('data', (row) => {
    manager.addDocument('en', row.url, row.label);
  })
  .on('end', () => {
    (async () => {
      await manager.train();
      console.log('Model trained successfully!');
    })();
  });


async function testText(text) {
  try {
    const response = await manager.process('en', text);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

// Test the model on some example text
testText('googel.com');
