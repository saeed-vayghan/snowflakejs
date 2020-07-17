# Description
Yet another snowflake sequence id generator

## Inspired By
This moduled is inspired by below:
1- https://developer.twitter.com/en/docs/basics/twitter-ids
1- https://www.callicoder.com/distributed-unique-id-sequence-number-generator/
1- https://www.npmjs.com/package/flake-idgen

## Why?
This moduled is implemented as a weekend project in order to understand the Twitter Snowflake ID generator.
You can find various Snowflake implementation on the net, others were too complicated to understand, So I decided to write a simple and readble one.



```bash
npm install snowflakejs

```

## How to use

#### javascript

```javascript

const SnowFlake = require('./flake');

const snowFlakeGen = new SnowFlake({ epoch: new Date().getTime(), machine: 15, worker: 10 });

const { binary, hex, err } = snowFlakeGen.next();

```

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).