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
  res.status(200).send({ msg: 'ok' });
});

router.get('/download/link', function (req, res) {
  // 규약 : Hash(아이디 + 구분자 + 구매일자 + 구분자 + Secret + 구분자 + FileName)
  // 구매일자는 timestamp 이며 millisecond 단위이다.
  const { origFileName, username, hash, purchase_ts } = _.pick(req.body, ['origFileName', 'username', 'hash', 'purchase_ts'])
  const origin_hash = validate.generate_hash(username, origFileName, purchase_ts)
  console.log(origin_hash)
  let link = 'api/v1/inventory/download/'
  if ( origin_hash == hash ) {
    const ts_now = date.timestamp_now()
    const days = date.ms_to_days(ts_now, parseInt(purchase_ts))
    // 1. 구매 일자 체크 (*유효기간 체크)
    // console.log('days: ', days)
    // console.log('download date',parseInt(config.maxDownloadDate))
    if (days > 0 && days < parseInt(config.maxDownloadDate)) {
      // console.log('now: ', ts_now),
      // console.log('purchase ts: ', parseInt(purchase_ts))
      if (fsutil.check_file_exists(hash)) {
        // 있다면 심링크 경로 리턴
        link = link =  hash
      } else {
        // 없으면 심링크 생성
        fsutil.generate_symlink(origFileName, hash)
        link = link + hash
        
      }
      // 2. 심링크 생성
      // 3. 링크 정보 출력
      res.status(201).send({msg: 'Link is created', link: link})
    } else {
      res.status(403).send({err: 'Now your purchase info is expired!'})
    }
  } else {
    res.status(403).send({err: 'You\'re not authorized' }) // Unauthorized
  }
})

router.get('/download/:hash', function(req, res) {
  // 파일 다운로드 실행
  
  // if(!= undefined ) {
  //   console.log(req.params.hash)
  //   res.status(200).send({})
  // } else {
  //   // console.log(req.params.hash)
  //   res.status(403).send({err: 'Not Found'})
  // }
  const {path, file} = fsutil.get_temp_file(req.params.hash)
  res.download(path,file); 
  
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