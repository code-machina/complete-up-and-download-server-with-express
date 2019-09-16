'use strict';
const router = require('express').Router();
const _ = require('lodash');
let jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const config = require('../../config');
const fsutil = require('../../util').fsutil(config.BASE_FILE_FOLDER)
const validate = require('../../util').validate
const date = require('../../util').date

router.get('/', async (req, res, next) => {
  // Ping Test 
  res.status(200).send({ msg: 'ok' });
});

router.post('/exist', function (req, res, next) {
  // 파일이 존재하는지 여부를 확인한다.
  console.log(req.body)
  const {origFileName} = _.pick(req.body, 'origFileName'); // Body 로부터 origFileName 파라미터를 읽어온다.
  console.log(origFileName)
  if (!origFileName) {
    // 파라미터가 충족되지 않을 경우 403 에러를 리턴한다.
    res.status(403).send({msg: 'Invalid Request'});
  } else {
    // 지정된 경로에서 파일을 체크한다.
    const exist = fsutil.check_file_exist(origFileName)
    console.log(exist)
    if (exist) {
      // 만약 존재한다면, true 를 리턴한다.
      res.status(200).send({ exist: true });
    } else {
      // 만약 파일이 없다면, false 를 리턴한다.
      res.status(200).send({ exist: false });
    }
  }
  // 함수 종료
});

router.get('/download/link', function (req, res) {
  // 규약 : sha256(아이디 + 구분자 + 구매일자 + 구분자 + Secret + 구분자 + FileName)
  // 구매일자는 timestamp 이며 millisecond 단위이다.
  // 원격 서버가 생성한 정보 명세를 체크
  const { origFileName, username, hash, purchase_ts } = _.pick(req.body, ['origFileName', 'username', 'hash', 'purchase_ts'])

  const ts_now = date.timestamp_now()
  const days = date.ms_to_days(ts_now, parseInt(purchase_ts))
  
  // 파일 정보를 체크
  const file_exist = fsutil.check_file_exist(origFileName)
  if (file_exist){// 파일이 존재
    // 해시값 생성
    
    if (days > 0 && days < parseInt(config.maxDownloadDate)) { // 만료기간체크
      // 90일 미만
      const server_hash = validate.generate_hash(username, origFileName, purchase_ts)
      console.log(server_hash)
      if (server_hash == hash ) { // 서버가 생성한 해시 비교
        // 해시가 일치
        if (fsutil.check_temp_file_exist(hash)) {
          // 있다면 심링크 경로 리턴
          res.status(200).send({key: hash})
        } else {
          // 없으면 심링크 생성
          if ( fsutil.generate_symlink(origFileName, hash) ) 
          { // 성공
            res.status(200).send({key: hash})
          } else { // 에러
            res.status(500).send({msg: 'Something Wrong'})
          }
        }
      } else {
        // 해시가 일치하지 않음
        res.status(403).send({msg: "Invalid Request"})
      }
    } else {
      // 90일 초과
      // symlink 를 삭제 처리
      del_symlink_only(hash)
      res.status(403).send({msg: 'your link is expired'})
    }
  } else {// 파일이 없는 경우 404 (Not Found) 전송
    res.status(404).send({msg: "Not Found"})
  }
})

router.get('/download/:hash', function(req, res) {
  // 파일 다운로드 실행
  if (fsutil.check_temp_file_exist(req.params.hash)) {
    const {path, file} = fsutil.get_temp_file(req.params.hash)
    res.download(path,file); 
  } else {
    res.status(404).send({msg: 'Not Found'});
  }
})

router.post('/temp-path', function (req, res) {
  const { msg, authkey } = _.pick(req.body, ['msg', 'authkey'])

  // 서버 간의 인증 키를 통해 접근 제어를 수행한다.
  try {
    console.log(_.pick(req.body, ['msg', 'authkey']))
    console.log(jwt.verify(req.body.msg, config.authkey))
  } catch(JsonWebTokenError) {
    // JWT 토큰 검증 에러가 발생할 경우, 인가되지 않은 사용자이다.
    return res.status(401).send({err: 'You\'re not authorized' }) // Unauthorized
  }
  return res.status(200).send({})
})

router.get

module.exports = router;