import { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

const CountdownTimer = (props) => {
    const [seconds, setSeconds] = useState(props.initialSeconds);

    useEffect(() => {
        let timer = null;

        const handleTimerTick = () => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        };

        const handleTimerExpired = () => {
            props.onTimerExpired();
            clearInterval(timer);
        };

        if (props.timerRunning && seconds > 0) {
            timer = setInterval(handleTimerTick, 1000);
        } else if (seconds <= 0) {
            handleTimerExpired();
        }

        return () => {
            clearInterval(timer);
        };
    }, [props.timerRunning, seconds]); // dipendenze corrette

    const formatTime = (timeInSeconds) => {
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${seconds} secondi rimanenti!`;
    };

    const calculateProgress = () => {
        return (seconds / props.initialSeconds) * 100;
    };

    return (
        <div>
            <h3 style={{ color: seconds <= 10 ? 'red' : 'black' }}>{formatTime(seconds)}</h3>
            <ProgressBar
                now={calculateProgress()}
                variant={seconds <= 10 ? 'danger' : 'primary'}
            />
        </div>
    );
};

export default CountdownTimer;
