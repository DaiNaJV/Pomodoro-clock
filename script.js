// Pomodoro Clock
// Implementa las user stories:
// - Ver temporizador de trabajo (25 min por defecto)
// - Al terminar, ver temporizador de descanso (5 min por defecto)
// - Iniciar / pausar / detener / reiniciar
// Bonus:
// - Sonido al llegar a 00:00
// - Personalizar duración de cada sesión
// - Descanso largo (10 min) cada 4ta sesión de descanso

const SESSION = {
  WORK: "work",
  BREAK: "break",
  LONG_BREAK: "longBreak",
};

const timerEl = document.getElementById("timer");
const sessionLabelEl = document.getElementById("session-label");
const cycleCountEl = document.getElementById("cycle-count");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");

const workInput = document.getElementById("work-input");
const breakInput = document.getElementById("break-input");
const longBreakInput = document.getElementById("long-break-input");

const alarmSound = document.getElementById("alarm-sound");

let currentSession = SESSION.WORK;
let secondsLeft = getDurationInSeconds(SESSION.WORK);
let intervalId = null;
let isRunning = false;
let completedWorkSessions = 0;

function getDurationInSeconds(session) {
  const minutes = {
    [SESSION.WORK]: Number(workInput.value) || 25,
    [SESSION.BREAK]: Number(breakInput.value) || 5,
    [SESSION.LONG_BREAK]: Number(longBreakInput.value) || 10,
  };
  return minutes[session] * 60;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateDisplay() {
  timerEl.textContent = formatTime(secondsLeft);

  const labels = {
    [SESSION.WORK]: "Sesión de trabajo",
    [SESSION.BREAK]: "Descanso corto",
    [SESSION.LONG_BREAK]: "Descanso largo",
  };
  sessionLabelEl.textContent = labels[currentSession];

  cycleCountEl.textContent = completedWorkSessions;
}

function tick() {
  if (secondsLeft > 0) {
    secondsLeft--;
    updateDisplay();
  } else {
    onSessionEnd();
  }
}

function onSessionEnd() {
  playAlarm();

  if (currentSession === SESSION.WORK) {
    completedWorkSessions++;
    // Cada 4ta sesión de descanso es un descanso largo
    currentSession =
      completedWorkSessions % 4 === 0 ? SESSION.LONG_BREAK : SESSION.BREAK;
  } else {
    currentSession = SESSION.WORK;
  }

  secondsLeft = getDurationInSeconds(currentSession);
  updateDisplay();
}

function playAlarm() {
  try {
    alarmSound.currentTime = 0;
    alarmSound.play();
  } catch (err) {
    // Algunos navegadores bloquean el autoplay hasta la primera interacción;
    // como el usuario ya presionó "Iniciar", normalmente no es un problema.
    console.warn("No se pudo reproducir el sonido de alarma:", err);
  }
}

function start() {
  if (isRunning) return;
  isRunning = true;
  intervalId = setInterval(tick, 1000);
  toggleButtons({ start: true, pause: false, stop: false, reset: true });
  toggleSettingsInputs(true);
}

function pause() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(intervalId);
  toggleButtons({ start: false, pause: true, stop: false, reset: false });
}

function stop() {
  isRunning = false;
  clearInterval(intervalId);
  currentSession = SESSION.WORK;
  secondsLeft = getDurationInSeconds(SESSION.WORK);
  completedWorkSessions = 0;
  updateDisplay();
  toggleButtons({ start: false, pause: true, stop: true, reset: false });
  toggleSettingsInputs(false);
}

function reset() {
  isRunning = false;
  clearInterval(intervalId);
  secondsLeft = getDurationInSeconds(currentSession);
  updateDisplay();
  toggleButtons({ start: false, pause: true, stop: true, reset: false });
}

function toggleButtons({ start, pause, stop, reset }) {
  startBtn.disabled = start;
  pauseBtn.disabled = pause;
  stopBtn.disabled = stop;
  resetBtn.disabled = reset;
}

function toggleSettingsInputs(disabled) {
  workInput.disabled = disabled;
  breakInput.disabled = disabled;
  longBreakInput.disabled = disabled;
}

startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);

[workInput, breakInput, longBreakInput].forEach((input) => {
  input.addEventListener("change", () => {
    if (!isRunning) {
      secondsLeft = getDurationInSeconds(currentSession);
      updateDisplay();
    }
  });
});

updateDisplay();
