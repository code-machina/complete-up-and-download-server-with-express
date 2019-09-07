'use strict';
// https://coderwall.com/p/rbfl6g/how-to-get-the-correct-unix-timestamp-from-any-date-in-javascript

function dhm(t){
  var cd = 24 * 60 * 60 * 1000,
      ch = 60 * 60 * 1000, // 
      d = Math.floor(t / cd),
      h = Math.floor( (t - d * cd) / ch),
      m = Math.round( (t - d * cd - h * ch) / 60000),
      pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  // return [d, pad(h), pad(m)].join(':');
  return d;
}

function date(){
  return {
    timestamp_now() {
      // 현재의 타임스탬프를 출력한다.
      const now = new Date()
      const ts = parseInt(now.getTime()) // unit: milliseconds
      console.log(ts);
      return ts;
    },
    from_utc_to_ts(date){
      // Date.parse()
    },
    ms_to_days(ts1, ts2) {
      if (ts1 > ts2 ) {
        return dhm(ts1 - ts2)
      } else {
        return  dhm(ts2 - ts1)
      }
    }
  }
}

module.exports = date();