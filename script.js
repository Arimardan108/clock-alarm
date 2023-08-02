let audio; // Declare the audio variable globally
let alarmRinging = false; // Global variable to track if alarm is ringing

// Get current time from user's system
function getCurrentTime() {
  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  let ampm;

  if (hour >= 12) {
    ampm = "PM";
    if (hour > 12) hour -= 12;
  } else {
    ampm = "AM";
    if (hour === 0) hour = 12;
  }

  return {
    hour: hour < 10 ? '0' + hour : '' + hour,
    minute: minute < 10 ? '0' + minute : minute,
    second: second < 10 ? '0' + second : second,
    ampm
  };
}

// Update clock display
function updateClock() {
  const currentTime = getCurrentTime();

  document.getElementById('hour').textContent = currentTime.hour;
  document.getElementById('minute').textContent = currentTime.minute;
  document.getElementById('second').textContent = currentTime.second;

  // Add an element with id "ampm" to your HTML to display the AM/PM value
  document.getElementById('ampm').textContent = currentTime.ampm;
  
}

// Generate options for hour select dropdown
function generateHourOptions() {
  const hourSelect = document.getElementById('alarm-hour');

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i < 10 ? '0' + i : i;
    hourSelect.appendChild(option);
  }
}

// Generate options for minute select dropdown
function generateMinuteOptions() {
  const minuteSelect = document.getElementById('alarm-minute');

  for (let i = 0; i <= 59; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = i < 10 ? '0' + i : i;
    minuteSelect.appendChild(option);
  }
}

// Call the functions to generate options for hour and minute select dropdowns
generateHourOptions();
generateMinuteOptions();

const alarmsList = document.querySelector("#alarms");
const alarmHour = document.querySelector("#alarm-hour");
const alarmMinute = document.querySelector("#alarm-minute");
const alarmTime = document.querySelector("#alarm-time");
const setAlarmButton = document.querySelector("#set-alarm-button");

let alarms = [];

setAlarmButton.addEventListener("click", function () {
  if (alarmRinging) {
    return; // Return early if the alarm is already ringing
  }

  const hour = alarmHour.value;
  const minute = alarmMinute.value;
  const time = alarmTime.value;

  if (!hour || !minute || !time) {
    alert("Please input a valid time for the alarm.");
    return;
  }

  const existingAlarm = alarms.find(function (alarm) {
    return alarm.hour === hour && alarm.minute === minute && alarm.time === time;
  });

  if (existingAlarm) {
    alert("This alarm time is already set.");
    return;
  }

  const alarm = {
    hour,
    minute,
    time
  };

  alarms.push(alarm);
  renderAlarms();
});

function renderAlarms() {
  alarmsList.innerHTML = "";

  alarms.forEach(function (alarm, index) {
    let hour = alarm.hour;
    let minute = alarm.minute;
    let time = alarm.time;

    if (hour.length === 1) {
      hour = "0" + hour;
    }

    if (minute.length === 1) {
      minute = "0" + minute;
    }

    time = time.toUpperCase();

    const li = document.createElement("li");
    li.textContent = hour + ":" + minute + " " + time;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      alarms.splice(index, 1);
      renderAlarms();
    });

    li.appendChild(deleteButton);
    alarmsList.appendChild(li);
  });
}

function checkAlarms() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentAmPm = currentHour >= 12 ? 'pm' : 'am';

  alarms.forEach(function (alarm, index) {
    const hour = parseInt(alarm.hour);
    const minute = parseInt(alarm.minute);
    const time = alarm.time.toLowerCase();
    let alarmHour = hour;

    // Convert alarm hour to 24-hour format if set for PM
    if (time === 'pm' && hour !== 12) {
      alarmHour = hour + 12;
    }

    // Convert 12 AM to 0 in 24-hour format
    if (time === 'am' && hour === 12) {
      alarmHour = 0;
    }

    if (alarmHour === currentHour && minute === currentMinute && time === currentAmPm) {
      playAlarm();
      alarms.splice(index, 1);
      renderAlarms();
    }
  });
}

let alarmTimeout; // Declare the alarmTimeout variable globally

function playAlarm() {
  alarmRinging = true;
  audio = new Audio("ring.mp3");
  audio.loop = true;
  audio.play();

  const stopButton = document.createElement("button");
  stopButton.textContent = "Stop Alarm";
  stopButton.addEventListener("click", function () {
    stopAlarm();
    buttonPlaceholder.innerHTML = "";
  });

  const buttonPlaceholder = document.getElementById("button-placeholder");
  buttonPlaceholder.innerHTML = "";
  buttonPlaceholder.appendChild(stopButton);

  const clockImage = document.getElementById("clock-image");
  clockImage.classList.add("move-clock");
}

function stopAlarm() {
  alarmRinging = false;
  clearTimeout(alarmTimeout);

  audio.pause();
  audio.currentTime = 0;

  const setAlarmButton = document.createElement("button");
  setAlarmButton.textContent = "Set Alarm";
  setAlarmButton.addEventListener("click", function () {
    playAlarm();
    buttonPlaceholder.innerHTML = "";
  });

  const buttonPlaceholder = document.getElementById("button-placeholder");
  buttonPlaceholder.innerHTML = "";
  buttonPlaceholder.appendChild(setAlarmButton);

  const clockImage = document.getElementById("clock-image");
  clockImage.classList.remove("move-clock");
}

// Update clock every second
setInterval(updateClock, 1000);
setInterval(checkAlarms, 1000);
