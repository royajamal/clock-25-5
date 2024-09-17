const initialState = {
  break: 5,
  breakTime: 300,
  session: 25,
  sessionTime: 1500,
  timeStatus: false,
  activeType: 'Session',
  progress: 0,
  progFactor: 0,
  stroke: '#4cd137',
  shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )',
};

const timerReducer = (state, action) => {
  // Set default state inside the function body
  const currentState = state || initialState;

  switch (action.type) {
    case 'SET_BREAK_LENGTH':
      return {
        ...currentState,
        break: action.payload,
        breakTime: action.payload * 60,
      };
    case 'SET_SESSION_LENGTH':
      return {
        ...currentState,
        session: action.payload,
        sessionTime: action.payload * 60,
      };
    case 'START_COUNTDOWN':
      return {
        ...currentState,
        timeStatus: true,
        intervalID: action.payload.intervalID,
        progFactor: action.payload.progFactor,
      };
    case 'STOP_COUNTDOWN':
      return {
        ...currentState,
        timeStatus: false,
        intervalID: null,
      };
    case 'TICK':
      return {
        ...currentState,
        [currentState.activeType === 'Session' ? 'sessionTime' : 'breakTime']: action.payload.time,
        progress: action.payload.progress,
      };
    case 'SWITCH_CLOCK_PHASE':
      return {
        ...currentState,
        activeType: action.payload.activeType,
        sessionTime: action.payload.sessionTime,
        breakTime: action.payload.breakTime,
        progFactor: action.payload.progFactor,
        progress: 0,
      };
    case 'RESET':
      return initialState;
    default:
      return currentState;
  }
};

export default timerReducer;
