'use strict';

const fs = require('fs'); // to access file system
const path = require('path');
const config = require('../config');

function fsutil(ROOT_DIR){
  // fsutil 함수는 ROOT_DIR 인자를 기반으로 동작한다.
  return {
    generate_symlink: function (src, dst){
      const dpath = path.resolve(config.BASE_TEMP_FOLDER, dst)
      const spath = path.resolve(config.BASE_FILE_FOLDER, src)
      fs.exists(dpath, function(exists) {
        if(!exists) {
          fs.symlinkSync(spath, dpath, function(err) {
            console.log(err);
            return false;
          })
          return true;
        } else {
          return true;
        }
      })
    },
    check_file_exists: function (fname) {
      const fpath = path.resolve(config.BASE_TEMP_FOLDER, fname)
      fs.exists(fpath, function(exists) {
        if (exists) return true;
        else return false;
      })
    },
    get_abs_path: function() {
      return path.resolve(ROOT_DIR)
    },
    find_filename: function(oirgfname) {
      const ofpath = path.join(this.get_abs_path(), origfname)
      if (fs.exists(ofpath)) {
        return ofpath;
      } else {
        return undefined;
      }
    },
    get_root_path: function () {
      return ROOT_DIR;
    },
    get_temp_file: function (hash) {
      const sympath = path.resolve(config.BASE_TEMP_FOLDER, hash)
      const realPath = fs.realpathSync(sympath)
      return { 
        path: realPath,
        file: path.basename(realPath)
      }

      console.log(sympath)
      fs.exists(sympath, function(exists) {
        if (exists) { return sympath } else { return undefined}
      })
    }
  }
};

module.exports = fsutil; 