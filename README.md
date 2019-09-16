# Complete Up N Down-load Server with Express.js

Express.js 를 이용한 업/다운로드 파일 서버입니다. DB-less 방식으로 임시 다운로드 링크를 생성하는 방식입니다. 
다운로드 서버와 웹 서비스 서버 간에 비밀키 공유가 필요합니다.

이 프로젝트는 다음의 요구사항을 만족합니다.

- 인가된 사용자에게만 다운로드 링크를 제공
- 다운로드 링크의 유효기간을 체크
- 데이터베이스를 이용하지 않은 간편한 구성
- 인가되지 않은 다운로드 시도 차단


## Depends On

- epxress.js

## How to start

```bash
npm run dev
```

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