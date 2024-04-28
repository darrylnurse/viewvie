//convert ms to 00:00:00.000'

//ms is number

//convert to 0x9 string

let startTest = "01:45:22:346";
let durationTest = "00:20:01:093";

function incrementTime(start = '00:00:00:000', duration = '00:00:00:000') {
  function formatAsNumber(timeString = "00:00:00.000") {
    return timeString //needs to be a number we can add to another value
        .replace('.', ':')
        .split(':')
        .join(''); // -> 000000000
  }

  let ms = '300300999';
  const addDuration = (timeString = '000000000', duration = 0) => { //input -> '000000000'
    let timeObj = {
      hours: Number(timeString.slice(0, 2)),
      minutes: Number(timeString.slice(2, 4)),
      seconds: Number(timeString.slice(4, 6)),
      milliseconds: Number(timeString.slice(6)),
    };

    timeObj.milliseconds += duration;
    timeObj.seconds += Math.floor(timeObj.milliseconds / 1000);
    timeObj.milliseconds %= 1000;
    timeObj.minutes += Math.floor(timeObj.seconds / 60);
    timeObj.seconds %= 60;
    timeObj.hours += Math.floor(timeObj.minutes / 60);
    timeObj.minutes %= 60;

    let hours = String(timeObj.hours).padStart(2, '0');
    let minutes = String(timeObj.minutes).padStart(2, '0');
    let seconds = String(timeObj.seconds).padStart(2, '0');
    let milliseconds = String(timeObj.milliseconds).padStart(3, '0');

    return hours + minutes + seconds + milliseconds;
  }

  function formatAsTime(valueString = "000000000") { //9 zeroes
    let timeOutput = "";
    const format = string => {
      if (string.length === 3) {
        timeOutput = timeOutput.slice(0, timeOutput.length - 1);
        timeOutput += '.' + string;
        return;
      }
      timeOutput += string.slice(0, 2) + ':';
      format(string.slice(2));
    }
    format(valueString);
    return timeOutput; // -> '00:00:00.000'
  }

  let startNumber = formatAsNumber(start); // 00:00:00:000 -> 000000000
  let addedStart = addDuration(startNumber, Number(formatAsNumber(duration))); //000000000 + X (duration)
  return formatAsTime(addedStart); //00000000X -> 00:00:00:00X
}

console.log(incrementTime(startTest, durationTest));