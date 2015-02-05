$(document).ready(function(e) {

  $('#hour-slider').slider({
    orientation: 'horizontal',
    min: 0,
    max: 23,
    range: 'min',
    slide: refreshDisplay,
    change: refreshDisplay
  });

  $('#minute-slider').slider({
    orientation: 'horizontal',
    min: 0,
    max: 59,
    range: 'min',
    slide: refreshDisplay,
    change: refreshDisplay
  });

  /* Refreshes the displayed time according to the position of sliders. */
  function refreshDisplay() {
    var hour = $('#hour-slider').slider('value');
    var minute = $('#minute-slider').slider('value');
    var time = formatTime(hour, minute);
    $('#display').text(time);
    $('#display-jp').text(convertNumbers(time));
    $('#display').removeClass('alarm-set');
    $('#display-jp').removeClass('alarm-set');
  }

  /* Formats the string so that the time is displayed correctly. */
  function formatTime(hour, minute) {
    var timeString = '';
    if (hour < 10) {
      timeString = '0'.concat(hour);
    } else {
      timeString = timeString.concat(hour);
    }
    if (minute < 10) {
      timeString = timeString.concat('0').concat(minute);
    } else {
      timeString = timeString.concat(minute);
    }
    return timeString;
  }

  /* Converts the numbers to Japanese kanji for numbers. */
  function convertNumbers(time) {
    var kanji = '';
    for (var i = 0; i < 4; i++) {
      switch (time.charAt(i)) {
        case '0': kanji = kanji.concat('◯'); break;
        case '1': kanji = kanji.concat('一'); break;
        case '2': kanji = kanji.concat('二'); break;
        case '3': kanji = kanji.concat('三'); break;
        case '4': kanji = kanji.concat('四'); break;
        case '5': kanji = kanji.concat('五'); break;
        case '6': kanji = kanji.concat('六'); break;
        case '7': kanji = kanji.concat('七'); break;
        case '8': kanji = kanji.concat('八'); break;
        case '9': kanji = kanji.concat('九'); break;
        default:  break;
      }
    }
    return kanji;
  }

  $('#set-alarm').button().click(setAlarm);
  $('#clear-alarm').button().click(clearAlarm);
  $('#stop').button().click(stopAlarm);
  $('#snooze').button().click(snooze);

  var alarmChecker;

  /* Sets the alarm to the time specified by the displayed time. */
  function setAlarm() {
    $('#display').addClass('alarm-set');
    $('#display-jp').addClass('alarm-set');
    var alarmTime = $('#display').text();
    var date;
    var hour;
    var minute;
    alarmChecker = setInterval(function(){checkAlarm(alarmTime, date, hour, minute);}, 1000);
  }

  /* If the alarm is set, it is canceled. */
  function clearAlarm() {
    $('#display').removeClass('alarm-set');
    $('#display-jp').removeClass('alarm-set');
    clearInterval(alarmChecker);
  }

  /* Stops the alarm, but sets it again so that the alarms goes
     off again in a short while. */
  function snooze() {
    stopAudio();
    addSnoozeInterval();
    setAlarm();
  }

  /* Sets the alarm to a time which is n minutes from the time
     when the alarm went off. */
  function addSnoozeInterval() {
    var snoozeIntervalInMinutes = 9;
    var date = new Date();
    date = new Date(date.getTime() + snoozeIntervalInMinutes*60000);
    var time = formatTime(date.getHours(), date.getMinutes());
    $('#display').text(time);
    $('#display-jp').text(convertNumbers(time));
  }

  /* Checks whether the current time matches the set time
     and if yes, it sets off the alarm. */
  function checkAlarm(alarmTime, date, hour, minute) {
    date = new Date();
    hour = date.getHours();
    minute = date.getMinutes();
    if (compareTime(hour, minute, alarmTime)) {
      setOffAlarm();
    }
  }

  /* Compares the current time and the time set on the alarm. */
  function compareTime(hour, minute, alarmTime) {
    if (hour < 10) {
      if (hour != alarmTime.charAt(1)) {
        return false;
      }
    } else {
      if (hour != alarmTime.substring(0, 2)) {
        return false;
      }
    }
    if (minute < 10) {
      if (minute != alarmTime.charAt(3)) {
        return false;
      }
    } else {
      if (minute != alarmTime.substring(2, 4)) {
        return false;
      }
    }
    return true;
  }

  /* Sets off the alarm and clears the alarm setting. */
  function setOffAlarm() {
    playAlarm();
    clearAlarm();
  }

  /* Plays the audio chosen for the alarm clock and shows the alarm display image and buttons to turn off the alarm. */
  function playAlarm() {
    $('#buttons-playing').show();
    $('#character-image').show();
    $('#character-image').animate({top: 0}, 1000, 'easeOutBounce');
    try {
      $('#character-voice')[0].play();
    } catch (ex) {
    }
  }

  /* Stops playback of the audio and hides the alarm display image and buttons to turn off the alarm. */
  function stopAlarm() {
    try {
      $('#character-voice')[0].pause();
      $('#character-voice')[0].currentTime = 0;
    } catch (ex) {
    }
    $('#buttons-playing').hide();
    $('#character-image').fadeOut(500, function(){$('#character-image').css({'top': -900})});
  }

});
