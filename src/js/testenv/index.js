const env = require('./env');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

(function() {
  'use strict';

  // Read command line parameters
  let params = process.argv.slice(2);

  // Check if sufficient command line parameters have been provieded
  if (params.length < 3) {
    console.log('Please provide the follwing command line parameters:');
    console.log('\t1. The number of instances (> 0).');
    console.log('\t2. The number of vertices (> 2).');
    console.log('\t3. The maximum capacity (> 0).');
    console.log('\t4. Verbose (0 or 1, defaults to 0)');

    process.exit(1);
  }

  let instances = parseInt(params[0], 10);
  let vertices = parseInt(params[1], 10);
  let maxCapacity = parseInt(params[2], 10);
  let verbose = !!params[3];

  if (isNaN(instances) || isNaN(vertices) || isNaN(maxCapacity)) {
    console.log('Please provide numbers as command line parameters.');
    process.exit(1);
  }

  if (instances <= 0) {
    console.log('The number of instances has to be above 0.');
    process.exit(1);
  }

  if (vertices <= 2) {
    console.log('The number of vertices has to be above 2.');
    process.exit(1);
  }

  if (maxCapacity <= 0) {
    console.log('The maximum capacity has to be above 0');
    process.exit(1);
  }

  // Run test environment
  console.log('Running test environment...');
  let result = env(instances, vertices, maxCapacity);
  let output = '';
  let str;

  for (var i = 0; i < instances; i++) {
    let instance = result[i];
    if (verbose) {
      instance.forEach((algo, index) => {
        str = algo.toString();
        output += str;
        if (index === instance.length - 1) {
          console.log(str);
        }
      });
    } else {
      str = instance[instance.length - 1].toString();
      output += str;
      console.log(str);
    }
  }

  // Manipulated iteration
  let manipulatedIteration = result[instances];
  str = manipulatedIteration.toString();
  output += str;
  console.log(str);
  // Summary
  let summary = result[instances + 1];
  str = summary.toString();
  output += str;
  console.log(str);

  console.log('\nFinished test!');

  let direxists = function direxists(path) {
    try {
      return fs.statSync(path).isDirectory();
    } catch (e) {
      return false;
    }
  };

  // Write log to file
  // Define log path
  const logdir = path.join(__dirname, '..', '..', '..', 'logs');
  // Create log dir if necessary
  if (!direxists(logdir)) {
    fs.mkdirSync(logdir);
  }
  // Build filename
  const logfile = `${moment().format('YYYYMMDD-HHmmss')}_ega-test_${instances}-${vertices}-${maxCapacity}.log`;
  const logpath = path.join(logdir, logfile);
  console.log(`Writing file to ${logpath}...`);
  fs.writeFile(logpath, output, (err) => {
    if (err) throw err;
    console.log('Done.');
  });

}());
