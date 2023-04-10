const { load } = require('node-arff');
const fs = require('fs');

// Load the original ARFF file
load('phishing_websites.arff', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    // Modify the data (e.g. remove the first instance)
    data.data.shift();

    // Convert the modified data to an ARFF string
    const arffString = data.format();

    // Write the ARFF string to a new file
    fs.writeFile('file.arff', arffString, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('File written successfully!');
      }
    });
  }
});