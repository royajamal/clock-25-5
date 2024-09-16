export const setBreakLength = (length) => ({
  type: 'SET_BREAK_LENGTH',
  payload: length,
});

export const setSessionLength = (length) => ({
  type: 'SET_SESSION_LENGTH',
  payload: length,
});

export const startCountdown = (intervalID, progFactor) => ({
  type: 'START_COUNTDOWN',
  payload: { intervalID, progFactor },
});

export const stopCountdown = () => ({
  type: 'STOP_COUNTDOWN',
});

export const tick = (time, progress) => ({
  type: 'TICK',
  payload: { time, progress },
});

export const switchClockPhase = (activeType, sessionTime, breakTime, progFactor) => ({
  type: 'SWITCH_CLOCK_PHASE',
  payload: {
    activeType,
    sessionTime,
    breakTime,
    progFactor,
  },
});

export const reset = () => ({
  type: 'RESET',
});
