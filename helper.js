'use strict';


const padding = (string, length, char) => {
  return length > 0 ? padding(char + string, --length, char) : string;
};

const toBinary = (num, length) => {
  const numString = num.toString(2);

  return numString.length === length ? numString : padding(numString, length - numString.length, '0')
};

const spliter = (input) => {
  const parts = (input.length % 4) ? [ input.substr( 0, i ) ] : [];

  for( let i = (input.length % 4); i < input.length ; i += 4 ) {
    parts.push( input.substr( i, 4 ) );
  }

  return parts.join(' ');
};

function binaryToHex(s) {
  let i, k, part, accum, ret = '';

  for (i = s.length-1; i >= 3; i -= 4) {

    // extract out in substrings of 4 and convert to hex
    part  = s.substr(i+1-4, 4);
    accum = 0;

    for (k = 0; k < 4; k += 1) {

      if (part[k] !== '0' && part[k] !== '1') {
        // invalid character
        return { valid: false };
      }

      // compute the length 4 substring
      accum = accum * 2 + parseInt(part[k], 10);
    }

    if (accum >= 10) {
      // 'A' to 'F'
      ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;

    } else {

      // '0' to '9'
      ret = String(accum) + ret;
    }
  }

  // remaining characters, i = 0, 1, or 2
  if (i >= 0) {

    accum = 0;

    // convert from front
    for (k = 0; k <= i; k += 1) {

      if (s[k] !== '0' && s[k] !== '1') {
        return { valid: false };
      }
      
      accum = accum * 2 + parseInt(s[k], 10);
    }

    // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
    ret = String(accum) + ret;
  }

  return {
    valid: true,
    result: ret
  };
};


module.exports = {
  padding,
  toBinary,
  spliter,
  binaryToHex
}