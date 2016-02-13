const env = require('./env');

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

    process.exit(1);
  }

  let instances = parseInt(params[0], 10);
  let vertices = parseInt(params[1], 10);
  let maxCapacity = parseInt(params[2], 10);

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

  let result = env(instances, vertices, maxCapacity);

  result.forEach((instance) => {
    instance.forEach((algo) => {
      console.log(algo.toString());
    });
  });

}());
