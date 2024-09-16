import React from 'react';
import { createRoot } from 'react-dom/client';

const projectName = 'pomodoro-clock';
localStorage.setItem('example_project', 'Pomodoro Clock');

class ClockFace extends React.Component {
  render() {
    const { type, format, countDown, reset, status, progressBar, stroke, shadow } = this.props;
    return (
      <div className="timer m-4">
        <div className="timer-wrapper">
          <div id="timer-label">
            {type}
          </div>
          <div id="time-left">
            {format}
          </div>
          <div className="timer-control m-4">
            <button id="start_stop" type="button" onClick={countDown} aria-label="Start/Stop">
              {status ? <i className="fa fa-pause fa-2x" /> : <i className="fa fa-play fa-2x" />}
            </button>
            <button id="reset" type="button" onClick={reset} aria-label="Reset">
              <i className="fa fa-undo fa-2x" />
            </button>
          </div>
        </div>
        <svg width="300" height="300" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadow }}>
          <circle id="grey-bar" r="100" cx="150" cy="150" fill="transparent" />
          <circle
            id="bar"
            r="100"
            cx="150"
            cy="150"
            fill="transparent"
            strokeDasharray="630"
            style={{ stroke, strokeDashoffset: `-${progressBar}` }}
          />
        </svg>
      </div>
    );
  }
}

class Controls extends React.Component {
  render() {
    const { labelID, decID, incID, lengthID, title, onClick, length } = this.props;
    return (
      <div className="length-control">
        <div id={labelID}>
          {title}
        </div>
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
          <div id={lengthID} className="btn-level">
            {length}
          </div>
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
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      breakTime: 300,
      session: 25,
      sessionTime: 1500,
      timeStatus: false,
      activeType: 'Session',
      intervalID: null,
      progress: 0,
      progFactor: 0,
      stroke: '#4cd137',
      shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )',
    };
    this.setLength = this.setLength.bind(this);
    this.beginCountDown = this.beginCountDown.bind(this);
    this.tickTock = this.tickTock.bind(this);
    this.rest = this.rest.bind(this);
    this.switchClockFace = this.switchClockFace.bind(this);
  }

  setLength(e) {
    const { timeStatus } = this.state;
    if (timeStatus !== true) {
      const arr = e.currentTarget.id.split('-');
      const type = arr[0];
      const op = arr[1];

      if (this.state[type] !== 1 && op === 'decrement') {
        this.setState(prevState => ({
          [type]: prevState[type] - 1,
          [`${type}Time`]: prevState[`${type}Time`] - 60,
        }));
      } else if (this.state[type] !== 60 && op === 'increment') {
        this.setState(prevState => ({
          [type]: prevState[type] + 1,
          [`${type}Time`]: prevState[`${type}Time`] + 60,
        }));
      }
    }
  }

  beginCountDown() {
    const { timeStatus, activeType } = this.state;
    if (!timeStatus) {
      const type = `${activeType.toLowerCase()}Time`;
      const interval = setInterval(this.tickTock, 1000);
      this.setState(prevState => ({
        timeStatus: true,
        intervalID: interval,
        progFactor: prevState.progFactor === 0 ? 630 / prevState[type] : prevState.progFactor,
      }));
    } else {
      clearInterval(this.state.intervalID);
      this.setState({
        timeStatus: false,
        intervalID: null,
      });
    }
  }

  tickTock() {
    this.setState(prevState => {
      const type = prevState.activeType === 'Session' ? 'sessionTime' : 'breakTime';
      const newTime = prevState[type] - 1;
      const newProgress = prevState.progress + prevState.progFactor;
      let newType = prevState.activeType;

      if (newTime < 0) {
        if (prevState.activeType === 'Session') {
          newType = 'Break';
          this.beeper.play();
          this.setState(prevState => ({ sessionTime: prevState.session * 60 }));
        } else {
          newType = 'Session';
          this.beeper.play();
          this.setState(prevState => ({ breakTime: prevState.break * 60 }));
        }

        return {
          [type]: newTime,
          activeType: newType,
          progress: 0,
          progFactor: 630 / (newType === 'Session' ? this.state.session * 60 : this.state.break * 60),
        };
      }

      return {
        [type]: newTime,
        progress: newProgress,
      };
    }, this.switchClockFace);
  }

  switchClockFace() {
    const { activeType } = this.state;
    const type = `${activeType.toLowerCase()}Time`;
    if (this.state[type] < 61) {
      this.setState({
        stroke: '#b71c1c',
        shadow: 'drop-shadow( 0px 0px 2px #e00b0ba8 )',
      });
    } else {
      this.setState({
        stroke: '#4cd137',
        shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )',
      });
    }
  }

  timeFormat() {
    const type = this.state.activeType === 'Session' ? 'sessionTime' : 'breakTime';
    let minutes = Math.floor(this.state[type] / 60);
    let seconds = this.state[type] - minutes * 60;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  rest() {
    clearInterval(this.state.intervalID);
    this.setState({
      break: 5,
      breakTime: 300,
      session: 25,
      sessionTime: 1500,
      timeStatus: false,
      activeType: 'Session',
      intervalID: null,
      progress: 0,
      progFactor: 0,
      stroke: '#4cd137',
      shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )',
    });
    this.beeper.pause();
    this.beeper.currentTime = 0;
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Pomodoro Clock</h1>

        <ClockFace
          type={this.state.activeType}
          format={this.timeFormat()}
          countDown={this.beginCountDown}
          reset={this.rest}
          status={this.state.timeStatus}
          progressBar={this.state.progress}
          stroke={this.state.stroke}
          shadow={this.state.shadow}
        />

        <div className="length-controls m-4">
          <Controls
            labelID="break-label"
            decID="break-decrement"
            incID="break-increment"
            lengthID="break-length"
            title="Break Length"
            onClick={this.setLength}
            length={this.state.break}
          />

          <Controls
            labelID="session-label"
            decID="session-decrement"
            incID="session-increment"
            lengthID="session-length"
            title="Session Length"
            onClick={this.setLength}
            length={this.state.session}
          />
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://www.dropbox.com/s/4v0bdjldf3kjl6s/beep.mp3?raw=1"
          ref={(audio) => { this.beeper = audio; }}
          aria-label="Notification sound"
        >
          <track default kind="metadata" />
        </audio>
      </div>
    );
  }
}

export default App;
