import '../css/common.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const dataInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

startBtn.addEventListener('click', onBtnClick);
startBtn.setAttribute('disabled', 'disabled');

let intervalId = null;
let deltaTime = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notiflix.Notify.failure('выберите дату в будущем!', {
        position: 'center-top',
        clickToClose: true,
        fontSize: '16px',
      });
      // alert('выберите дату в будущем!');
      return;
    } else {
      startBtn.removeAttribute('disabled', 'disabled');
      deltaTime = selectedDates[0] - Date.now();
    }
    console.log(selectedDates[0]);
  },
};

flatpickr(dataInput, options);

function onBtnClick() {
  startBtn.setAttribute('disabled', 'disabled');

  intervalId = setInterval(() => {
    deltaTime -= 1000;
    const { days, hours, minutes, seconds } = convertMs(deltaTime);
    outputCounter(days, hours, minutes, seconds);

    if (deltaTime < 1000) {
      clearInterval(intervalId);
    }
  }, 1000);

  if (deltaTime < 1000) {
    clearInterval(intervalId);
  }
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZeroByDays(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function outputCounter(days, hours, minutes, seconds) {
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function addLeadingZeroByDays(value) {
  return String(value).padStart(3, '0');
}
