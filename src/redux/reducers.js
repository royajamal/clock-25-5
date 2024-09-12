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
    shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )'
  };
  
  const timerReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_BREAK_LENGTH':
        return {
          ...state,
          break: action.payload,
          breakTime: action.payload * 60,
        };
      case 'SET_SESSION_LENGTH':
        return {
          ...state,
          session: action.payload,
          sessionTime: action.payload * 60,
        };
      case 'START_COUNTDOWN':
        return {
          ...state,
          timeStatus: true,
          intervalID: action.payload.intervalID,
          progFactor: action.payload.progFactor
        };
      case 'STOP_COUNTDOWN':
        return {
          ...state,
          timeStatus: false,
          intervalID: null
        };
      case 'TICK':
        return {
          ...state,
          [state.activeType === 'Session' ? 'sessionTime' : 'breakTime']: action.payload.time,
          progress: action.payload.progress
        };
      case 'SWITCH_CLOCK_PHASE':
        return {
          ...state,
          activeType: action.payload.activeType,
          sessionTime: action.payload.sessionTime,
          breakTime: action.payload.breakTime,
          progFactor: action.payload.progFactor,
          progress: 0
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };
  