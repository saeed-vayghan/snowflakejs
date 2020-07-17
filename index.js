'use strict';

const { padding, toBinary, spliter, binaryToHex } = require('./helper');


/**
 * @param {object} config
 * @param {Number} config.machine - Datacenter identifier (0...31).
 * @param {Number} config.worker - Worker identifier (0...31).
 * @param {Number} config.epoch - Starting unix time point.
 */
const SnowFlake = function (config) {
  /*
   * Configure options
   *
   * 0xFFFF = 65535
   * 0x1000 = 4096
   * 0xFFF  = 4095
   * 0x1F   = 31
   *
   * The returning binary id consists of 4 parts
   * Part 1: The first bit is the unused symbol bit. (might be used later)
   * Part 2: Composed of 41 bit time stamp (MS), whose value is the offset of the current time relative to a certain time.
   * Part 3: The five bits which represent the machine identifier (allowed values: 0...31)
   * Part 4: The five bits which represent the worker identifier (allowed values: 0...31)
   */
  const options = {
    machine: config.machine || 0,
    worker: config.worker || 0,
    epoch: config.epoch || 0
  };

  // Force id to be less than 31
  this.machine = options.machine & 0x1F;
  this.worker  = options.worker & 0x1F;

  // Makes machine to be a 10 bits digit in advance of bitwise OR with worker
  this.id = (this.machine << 5) | this.worker;

  this.epoch    = options.epoch || 0;
  this.seqMask  = 0x1000
  this.seq      = 0; // A local counter per machine that rolls over every 4096.
  this.nextSeq  = 0;
  this.lastTime = 0;
  this.overflow = false;

  this.reject = () => {
    let err = 'Invalid System Clock!';

    if (this.overflow) {
      err = 'Sequence exceeded its maximum value. Provide callback function to handle sequence overflow';
    }

    return {
      err
    }
  };

  this.next = () => {
    const time = Math.round((Date.now() - this.epoch) / 1000);

    this.seq = this.nextSeq

    if ( time < this.lastTime ) {
      return this.reject();
    }

    if ( time <= this.lastTime ) {
      /*
       * If all sequencec have been used (from 0 to 4095), then overflow would have been set as TRUE.
       * Wait till next time window.
       */
      if (this.overflow) {
        return this.reject();
      }

      /*
       * Increase sequence and check the sequence boundary
       */
      if ( ++this.nextSeq > this.seqMask ) {
        this.overflow = true;
        return this.reject();
      }

    } else {
      /*
       * Starting next time window
       */

      this.overflow = false;
      this.seq = 0;
      this.nextSeq = 1;
    }

    this.lastTime = time;

    const binaryTime = toBinary(Number(time), 41)
    const binaryId   = toBinary(Number(this.id), 10)
    const binarySeq  = toBinary(Number(this.seq), 12)
    
    const binary = `0${binaryTime}${binaryId}${binarySeq}`
    const toHex  = binaryToHex(binary)

    return {
      binary: {
        raw: binary,
        splited: spliter(binary)
      },
      hex: toHex.result
    };
  };
};


module.exports = SnowFlake