export function changeFormatTime(data) {
  // set total time

  const time = data.toString().split('.')[0];

  let timebar = '';
  const hours = '';
  var mins = '';
  var seconds = '';
  if (time < 10) {
    // 0s ~ 9s
    mins = '0';
    seconds = `0${time}`;
    timebar = `${mins}:${seconds}`;
  } else if (time >= 10 && time < 60) {
    // 10s ~ 59s
    mins = '0';
    seconds = time;
    timebar = `${mins}:${seconds}`;
  } else if (time >= 60 && time < 600) {
    // 1 ~ 9 mins
    var mins = `0${(time / 60).toString().split('.')[0]}`;
    var seconds = (time % 60).toString().split('.')[0];
    if (seconds < 10) seconds = `0${seconds}`;
    timebar = `${mins}:${seconds}`;
  } else if (time >= 60 && time < 600) {
    // 10 ~ 59 mins
    var mins = (time / 60).toString().split('.')[0];
    var seconds = (time % 60).toString().split('.')[0];
    if (seconds < 10) seconds = `0${seconds}`;
    timebar = `${mins}:${seconds}`;
  }

  return timebar;
  //
}
