import { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

const CountdownTimer = (props) => {
    const [seconds, setSeconds] = useState(props.initialSeconds);

    useEffect(() => {
        // Exit early if countdown is finished or timerRunning is false
        if (!props.timerRunning || seconds <= 0) {
            if (seconds <= 0) {
                props.onTimerExpired(); // Call the callback function provided by the parent component
            }
            return;
        }

        // Set up the timer
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        // Clean up the timer
        return () => clearInterval(timer);
    }, [props, seconds]);

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
