import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function ClockFace({
  type,
  format,
  countDown,
  reset,
  status,
  progressBar,
  stroke,
  shadow,
}) {
  return (
    <div className="timer m-4">
      <div className="timer-wrapper">
        <div id="timer-label">{type}</div>
        <div id="time-left">{format}</div>
        <div className="timer-control m-4">
          <button
            id="start_stop"
            type="button"
            onClick={countDown}
            aria-label="Start/Stop"
          >
            {status ? (
              <i className="fa fa-pause fa-2x" />
            ) : (
              <i className="fa fa-play fa-2x" />
            )}
          </button>
          <button
            id="reset"
            type="button"
            onClick={reset}
            aria-label="Reset"
          >
            <i className="fa fa-undo fa-2x" />
          </button>
        </div>
      </div>
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: shadow }}
      >
        <circle
          id="grey-bar"
          r="100"
          cx="150"
          cy="150"
          fill="transparent"
        />
        <circle
          id="bar"
          r="100"
          cx="150"
          cy="150"
          fill="transparent"
          strokeDasharray="630"
          style={{
            stroke,
            strokeDashoffset: -progressBar,
          }}
        />
      </svg>
    </div>
  );
}

ClockFace.propTypes = {
  type: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  countDown: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  status: PropTypes.bool.isRequired,
  progressBar: PropTypes.number.isRequired,
  stroke: PropTypes.string.isRequired,
  shadow: PropTypes.string.isRequired,
};

function Controls({
  labelID,
  decID,
  incID,
  lengthID,
  title,
  onClick,
  length,
}) {
  return (
    <div className="length-control">
      <div id={labelID}>{title}</div>
      <div className="controllers">
        <button
          id={decID}
          className="btn-level"
          onClick={onClick}
          type="button"
          aria-label={`Decrease ${title}`}
        >
          <i className="fa fa-chevron-left fa-1x" />
        </button>
        <div id={lengthID} className="btn-level">{length}</div>
        <button
          id={incID}
          className="btn-level"
          onClick={onClick}
          type="button"
          aria-label={`Increase ${title}`}
        >
          <i className="fa fa-chevron-right fa-1x" />
        </button>
      </div>
    </div>
  );
}

Controls.propTypes = {
  labelID: PropTypes.string.isRequired,
  decID: PropTypes.string.isRequired,
  incID: PropTypes.string.isRequired,
  lengthID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  length: PropTypes.number.isRequired,
};

function App() {
  const [breakTime, setBreakTime] = useState(300);
  const [sessionTime, setSessionTime] = useState(1500);
  const [timeStatus, setTimeStatus] = useState(false);
  const [activeType, setActiveType] = useState('Session');
  const [progress, setProgress] = useState(0);
  const [progFactor, setProgFactor] = useState(0);
  const [stroke, setStroke] = useState('#4cd137');
  const [shadow, setShadow] = useState('drop-shadow(0px 0px 2px #4cd137a8)');
  const [intervalID, setIntervalID] = useState(null);

  const beeper = useRef(null);

  const setLength = (e) => {
    if (!timeStatus) {
      const [type, op] = e.currentTarget.id.split('-');
      if (type === 'break') {
        setBreakTime((prev) => {
          if (op === 'decrement' && prev > 60) {
            return prev - 60;
          }
          if (op === 'increment' && prev < 3600) {
            return prev + 60;
          }
          return prev;
        });
      } else if (type === 'session') {
        setSessionTime((prev) => {
          if (op === 'decrement' && prev > 60) {
            return prev - 60;
          }
          if (op === 'increment' && prev < 3600) {
            return prev + 60;
          }
          return prev;
        });
      }
    }
  };

  const tickTock = () => {
    const newTime = activeType === 'Session' ? sessionTime - 1 : breakTime - 1;
    const newProgress = progress + progFactor;

    if (newTime < 0) {
      const newType = activeType === 'Session' ? 'Break' : 'Session';
      beeper.current.play();
      setProgress(0);
      setActiveType(newType);
      setProgFactor(630 / (newType === 'Session' ? sessionTime : breakTime));
      return;
    }

    if (activeType === 'Session') {
      setSessionTime(newTime);
    } else {
      setBreakTime(newTime);
    }
    setProgress(newProgress);
  };

  const beginCountDown = () => {
    if (!timeStatus) {
      const interval = setInterval(tickTock, 1000);
      setTimeStatus(true);
      setIntervalID(interval);
      setProgFactor(630 / (activeType === 'Session' ? sessionTime : breakTime));
    } else {
      clearInterval(intervalID);
      setTimeStatus(false);
      setIntervalID(null);
    }
  };

  useEffect(() => {
    if (sessionTime < 61) {
      setStroke('#b71c1c');
      setShadow('drop-shadow(0px 0px 2px #e00b0ba8)');
    } else {
      setStroke('#4cd137');
      setShadow('drop-shadow(0px 0px 2px #4cd137a8)');
    }
  }, [sessionTime, breakTime]);

  const timeFormat = () => {
    const type = activeType === 'Session' ? sessionTime : breakTime;
    let minutes = Math.floor(type / 60);
    let seconds = type % 60;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  };

  const reset = () => {
    clearInterval(intervalID);
    setBreakTime(300);
    setSessionTime(1500);
    setTimeStatus(false);
    setActiveType('Session');
    setProgress(0);
    setProgFactor(0);
    setStroke('#4cd137');
    setShadow('drop-shadow(0px 0px 2px #4cd137a8)');
    if (beeper.current) {
      beeper.current.pause();
      beeper.current.currentTime = 0;
    }
  };

  return (
    <div className="container">
      <h1 className="title">Pomodoro Clock</h1>

      <ClockFace
        type={activeType}
        format={timeFormat()}
        countDown={beginCountDown}
        reset={reset}
        status={timeStatus}
        progressBar={progress}
        stroke={stroke}
        shadow={shadow}
      />

      <div className="length-controls m-4">
        <Controls
          labelID="break-label"
          decID="break-decrement"
          incID="break-increment"
          lengthID="break-length"
          title="Break Length"
          onClick={setLength}
          length={breakTime / 60}
        />
        <Controls
          labelID="session-label"
          decID="session-decrement"
          incID="session-increment"
          lengthID="session-length"
          title="Session Length"
          onClick={setLength}
          length={sessionTime / 60}
        />
      </div>

      <audio
        id="beep"
        preload="auto"
        src="https://www.dropbox.com/s/4v0bdjldf3/beep.mp3"
        ref={beeper}
      >
        <track kind="captions" srcLang="en" label="No captions available" />
      </audio>
    </div>
  );
}

export default App;
