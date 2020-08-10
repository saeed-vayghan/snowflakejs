## Description
Yet another snowflake sequence id generator.

## Inspired By
This moduled is inspired by:

1. https://developer.twitter.com/en/docs/basics/twitter-ids
1. https://www.callicoder.com/distributed-unique-id-sequence-number-generator/
1. https://www.npmjs.com/package/flake-idgen

## Why?
This moduled is implemented as a weekend project in order to understand the Twitter Snowflake ID generator.
You can find various Snowflake implementation on the net, others were too complicated to understand, So I decided to write a simple and readble one.


### How could you implement unique id's over a set of N servers?   

#### why not use GUIDs?
- Mostly because GUIDs are big, and they index badly
- Generated IDs should be sortable by time
- Index size is a key consideration
- If you can’t keep your indexes in memory, you can’t keep your database fast

<br><br>

## # solutions

#### Solution 1:Generate IDs in web application
This approach leaves **ID generation** entirely up to your **application**, and not up to the **database at all**.
Implementation: `MongoDB’s ObjectId, UUID`

> Pros1: Each application thread generates IDs independently, minimizing points of failure and contention for ID generation.
> Pros2: If you use a timestamp as the first component of the ID, the IDs remain time-sortable.
> 
> Cons1: Generally requires more storage space (96 bits or higher) to make reasonable uniqueness guarantees.
> Cons2: Some UUID types are completely random and have no natural sort

<br><br>
#### Solution 2:  Generate IDs through dedicated service (Snowflake)

> Pros1: Snowflake IDs are 64-bits, half the size of a UUID.
> Pros2: Can use time as first component and remain sortable.
> Pros3: Distributed system.
> 
> Cons1: Would introduce additional complexity.

<br><br>
#### Solution 3:  DB Ticket Servers (flickr database Ticket Servers)
This approach uses a centralized database server to generate unique incrementing IDs. It’s like a centralized auto-increment. This approach is used by Flickr.

> Pros1: DBs are well understood and have pretty predictable scaling factors.
>
> Cons1: Can eventually become a write bottleneck.
> Cons2: An additional couple of machines.
> Cons3: If using a single DB, becomes single point of failure. If using multiple DBs, can no longer guarantee that they are sortable over time.


<br><br>
#### Solution 4: Sharded system based on postgress schema
Link: https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c

<br><br>


## How to use
```bash
npm install simple-snowflake

```

#### javascript

```javascript

const SnowFlake = require('simple-snowflake');

const snowFlakeGen = new SnowFlake({ epoch: new Date().getTime(), machine: 15, worker: 10 });

const { binary, hex, err } = snowFlakeGen.next();

/*
  binary ==> {
    raw: '0000000000000000000000000000000000000000000111101010000000001010',
    splited: '0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0001 1110 1010 0000 0000 1010'
  }
  hex ==> 00000000001EA00A
*/

```

## License

This project is licensed under the terms of the
[MIT license](/LICENSE).
