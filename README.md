# Complete Up N Down-load Server with Express.js

Express.js 를 이용한 업/다운로드 파일 서버입니다. 

## Depends On

- epxress.js
- multer

## To use es6 feature 

아래의 명령어를 통해서 es6 feature 를 사용할 수 있도록 설정한다.

```bash
npm install --save-dev @babel/core @babel/preset-env
```

```bash
$ touch .babelrc
$ echo { "presets": ["@babel/preset-env"] } >> ./.babelrc
```


## 다운로드 임시 파일 생성

아래의 명령어를 통해 테스트 파일을 생성한다.

```bash
$ truncate -s 100m test2.zip
```

## 심링크 생성하기