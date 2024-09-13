import React from 'react';
import ReactDOM from 'react-dom';

const projectName = 'pomodoro-clock';
localStorage.setItem('example_project', 'Pomodoro Clock');

class ClockFace extends React.Component {
    render() {
        return (
            <div className="timer m-4">
                <div className="timer-wrapper">
                    <div id='timer-label'>
                        {this.props.type}
                    </div>
                    <div id='time-left'>
                        {this.props.format}
                    </div>
                    <div className="timer-control m-4">
                        <button id="start_stop" onClick={this.props.countDown}>
                            {this.props.status ? <i className="fa fa-pause fa-2x" /> : <i className="fa fa-play fa-2x" />}
                        </button>
                        <button id="reset" onClick={this.props.reset}>
                            <i className="fa fa-undo fa-2x" />
                        </button>
                    </div>
                </div>
                <svg width="300" height="300" viewport="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" style={{filter: this.props.shadow}}>
                    <circle id="grey-bar" r="100" cx="150" cy="150" fill="transparent"></circle>
                    <circle id="bar" r="100" cx="150" cy="150" fill="transparent" strokeDasharray="630" 
                    style={{stroke: this.props.stroke, strokeDashoffset: '-' + this.props.progressBar }}></circle>
                </svg>
            </div>
        );
    }
}

class Controls extends React.Component {
    render() {
        return (
            <div className="length-control">
                <div id={this.props.labelID}>
                    {this.props.title}
                </div>
                <div className="controllers">
                    <button id={this.props.decID}
                        className="btn-level"
                        onClick={this.props.onClick}>
                        <i className="fa fa-chevron-left fa-1x" />
                    </button>

                    <div id={this.props.lengthID} className="btn-level">
                        {this.props.length}
                    </div>

                    <button id={this.props.incID}
                        className="btn-level"
                        onClick={this.props.onClick}>
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
            intervalID: '',
            progress: 0,
            progFactor: 0,
            stroke: '#4cd137',
            shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )'
        }
        this.setLength = this.setLength.bind(this);
        this.beginCountDown = this.beginCountDown.bind(this);
        this.tickTock = this.tickTock.bind(this);
        this.rest = this.rest.bind(this);
        this.switchClockFace = this.switchClockFace.bind(this);
    }

    setLength(e) {
        if (this.state.timeStatus !== true) {
            var arr, type, op;
            arr = e.currentTarget.id.split('-');
            type = arr[0];
            op = arr[1];

            if (this.state[type] !== 1 && op === 'decrement') {
                this.setState({
                    [type]: this.state[type] - 1,
                    [type + 'Time']: this.state[type + 'Time'] - 60,
                })
            } else if (this.state[type] !== 60 && op === 'increment') {
                this.setState({
                    [type]: this.state[type] + 1,
                    [type + 'Time']: this.state[type + 'Time'] + 60
                })
            }
        }
    }

    beginCountDown() {
        if (this.state.timeStatus === false) {
            var type = this.state.activeType.toLowerCase() + 'Time'
            var interval = setInterval(this.tickTock, 1000);
            this.setState({
                timeStatus: true,
                intervalID: interval,
                progFactor: this.state.progFactor === 0 ? 630 / this.state[type] : this.state.progFactor
            })
        } else {
            clearInterval(this.state.intervalID)
            this.setState({
                timeStatus: false,
                intervalID: ''
            })
        }
    }

    tickTock() {
        this.state.activeType === 'Session' ?
            this.setState({ sessionTime: this.state.sessionTime - 1, progress: this.state.progress + this.state.progFactor }) :
            this.setState({ breakTime: this.state.breakTime - 1, progress: this.state.progress + this.state.progFactor });

        this.switchClockFace()
    }

    switchClockFace() {
        var type = this.state.activeType.toLowerCase() + 'Time'
        if (this.state[type] < 61) {
            this.setState({
                stroke: '#b71c1c',
                shadow: 'drop-shadow( 0px 0px 2px #e00b0ba8 )'
            })
        } else {
            this.setState({
                stroke: '#4cd137',
                shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )'
            })
        }
        if (this.state[type] === 0) {
            this.beeper.play();
        }
        if (this.state[type] < 0) {
            this.state.activeType === 'Session' ?
                this.setState({ activeType: 'Break', sessionTime: this.state.session * 60, progFactor: 630 / (this.state.break * 60), progress: 0 }) :
                this.setState({ activeType: 'Session', breakTime: this.state.break * 60, progFactor: 630 / (this.state.session * 60), progress: 0 });
        }
    }

    timeFormat() {
        var type = '';
        if (this.state.activeType === "Session") {
            type = "sessionTime"
        } else {
            type = "breakTime"
        }
        let minutes = Math.floor(this.state[type] / 60);
        let seconds = this.state[type] - minutes * 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return minutes + ':' + seconds;
    }

    rest() {
        clearInterval(this.state.intervalID)
        this.setState({
            break: 5,
            breakTime: 300,
            session: 25,
            sessionTime: 1500,
            timeStatus: false,
            activeType: 'Session',
            intervalID: '',
            progress: 0,
            progFactor: 0,
            stroke: '#4cd137',
            shadow: 'drop-shadow( 0px 0px 2px #4cd137a8 )'
        })
        this.beeper.pause();
        this.beeper.currentTime = 0;
    }

    render() {
        return (
            <div className="container">
                <h1 className="title">Pomodoro Clock</h1>

                <ClockFace
                    type={this.state.activeType} format={this.timeFormat()}
                    countDown={this.beginCountDown} reset={this.rest}
                    status={this.state.timeStatus} progressBar={this.state.progress}
                    stroke={this.state.stroke} shadow={this.state.shadow} />

                <div className="length-controls m-4">
                    <Controls
                        labelID="break-label" decID="break-decrement"
                        incID="break-increment" lengthID="break-length"
                        title="Break Length" onClick={this.setLength}
                        length={this.state.break} />

                    <Controls
                        labelID="session-label" decID="session-decrement"
                        incID="session-increment" lengthID="session-length"
                        title="Session Length" onClick={this.setLength}
                        length={this.state.session} />

                </div>
                <audio id="beep" preload="auto" src="https://www.dropbox.com/s/4v0bdjldf3kjl6s/beep.mp3?raw=1"
                    ref={(audio) => {
                        this.beeper = audio;
                    }}></audio>
            </div>
        );
    }
}

export default App;

ReactDOM.render(<App />, document.getElementById('root'));
