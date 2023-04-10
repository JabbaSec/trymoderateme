const tf = require('@tensorflow/tfjs');
const arff = require('node-arff');
const fs = require('fs');

// Step 1: Load the model
const model = await tf.loadLayersModel('file://model.json');

// Step 2: Load the list of URLs to check
const urls = fs.readFileSync('urls.txt', 'utf8').split('\n');

// Step 3: Preprocess the URLs
const features = urls.map(url => [
  url.length,
  countCharOccurrences(url, '.'),
  countCharOccurrences(url, '-'),
  countCharOccurrences(url, '/'),
  countCharOccurrences(url, '.'),
  url.includes('@') ? 1 : 0,
  url.includes('-') ? 1 : 0,
  url.includes('//') ? 1 : 0,
  url.includes('http') ? 1 : 0,
  url.includes('https') ? 1 : 0,
  url.includes('/') ? 1 : 0,
]);

function countCharOccurrences(str, char) {
  return str.split(char).length - 1;
}

// Step 4: Make predictions
const xs = tf.tensor2d(features);
const predictions = model.predict(xs);
const labels = predictions.argMax(1).dataSync();

// Step 5: Print results
for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const label = labels[i];
  console.log(`${url} => ${label === 1 ? 'Phishing' : 'Not phishing'}`);
}