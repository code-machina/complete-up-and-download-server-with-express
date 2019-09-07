'use strict';

const config = require('../config');
const crypto = require('crypto');


function validator (config) {
  return {
    validate_allowed_host: function (hostname) {
        const foundOne = config.allowed_hosts.find((b) => { return b == hostname;});
        if (foundOne) {
          return true;
        } else {
          return false;
        }

    },
    generate_hash: function (username, origFileName, purchase_date) {
      // 규약 : Hash(아이디 + 구분자 + 구매일자 + 구분자 + Secret + 구분자 + FileName)
      // 규약 : 구매일자 양식 (iso-format)
      const sha256 = crypto.createHash('sha256')
      sha256.update(
        username + '!' + purchase_date + '!' + config.secret + '!' + origFileName
      )
      return sha256.digest('hex');
    }
  }
}

module.exports = validator(config);