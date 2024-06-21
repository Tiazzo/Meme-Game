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
    }, [props.timerRunning, seconds]);

    const formatTime = (timeInSeconds) => {
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${seconds} secondi rimanenti!`;
    };

    const calculateProgress = () => {
        return (seconds / props.initialSeconds) * 100;
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px"
        }}>
            <h3 style={{
                marginBottom: "10px",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: seconds <= 10 ? '#FF5555' : "#F8F8F2"
            }} >{formatTime(seconds)}</h3>
            <ProgressBar
                style={{
                    width: "100%",
                    maxWidth: "300px",
                    marginBottom: "20px",
                }}
                now={calculateProgress()}
                variant={seconds <= 10 ? 'danger' : 'primary'}
            />
        </div >
    );
};

export default CountdownTimer;
