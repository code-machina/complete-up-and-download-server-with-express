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
      if (!this.check_temp_file_exist(dpath)){ // 심링크가 없음
        try {
          fs.symlinkSync(spath, dpath)
          return true; // 파일 생성 성공
        } catch {
          console.log('Symlink 생성 중에 에러가 발생')
          return false; // 파일 생성 에러
        }
      } else { // 심링크가 있음
        return true;
      }
    },
    check_file_exist: function (fname) {
      /* 원본 파일이 존재하는지 체크한다.
       */
      const fpath = path.resolve(config.BASE_FILE_FOLDER, fname)
      console.log(fpath)
      if ( fs.existsSync(fpath) ) {
        return true;
      }else {
        return false;
      }
    },
    check_temp_file_exist: function (fname) {
      /* 해시 Symlink 에 파일이 존재하는 지 체크한다.
      우선, sync 버전으로 돌린다.
       */
      const fpath = path.resolve(config.BASE_TEMP_FOLDER, fname)
      console.log(fpath)
      if ( fs.existsSync(fpath) ) {
        return true;
      }else {
        return false;
      }
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
    },
    del_symlink_only: function (hash) {
      // WARNING: 이 함수는 위험할 수 있으므로 항상, 절대 경로이어야 합니다.
      const sympath = path.resolve(config.BASE_TEMP_FOLDER, hash)
      try {
        fs.unlinkSync(sympath)
        return true; // unlink 성공
      } catch {
        return false; // unlink 실패(?)
      }
      
      
    }
  }
};

module.exports = fsutil; 