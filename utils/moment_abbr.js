import moment from 'moment';

export default () =>
  moment.updateLocale('en', {
    relativeTime: {
      now: 'now',
      future: 'in %s',
      past: '%s',
      s: '1s',
      ss: '%d s',
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1d',
      dd: '%dd',
      w: '1w',
      ww: '%dw',
      M: '1m',
      MM: '%dm',
      y: '1y',
      yy: '%dy',
    },
  });
