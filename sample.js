'use strict';

const SnowFlake = require('./index');

const snowFlakeGen = new SnowFlake({ epoch: new Date().getTime(), machine: 15, worker: 10 });


const test = async function () {
  for (let i=0; i<=10; i++) {
    const { binary, hex, err } = snowFlakeGen.next();

    if (err) {
      console.log('err ==>', err);
    } else {
      console.log('binary ==>', binary);
      console.log('hex ==>', hex);
    }

    // await new Promise(resolve => setTimeout(resolve, 200));
  }
};

test();