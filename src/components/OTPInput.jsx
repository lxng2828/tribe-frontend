import React from 'react';
import useOTPInput from '../hooks/useOTPInput';

const OTPInput = ({ length = 6, value, onChange, onComplete, disabled = false, error = false }) => {
    const {
        otp,
        setOtp,
        focused,
        setFocused,
        inputRef,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleFocus,
        handleBlur,
        clearOTP,
        isComplete
    } = useOTPInput(length);

    // Sync với value từ props
    React.useEffect(() => {
        if (value !== otp) {
            setOtp(value || '');
        }
    }, [value, otp, setOtp]);

    // Sync với onChange callback
    React.useEffect(() => {
        console.log('OTPInput - otp changed:', otp, 'focused:', focused);
        if (onChange) {
            onChange(otp);
        }
        if (onComplete && isComplete) {
            onComplete(otp);
        }
    }, [otp, onChange, onComplete, isComplete]);

    // Auto-focus khi component mount
    React.useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const renderOTPBoxes = () => {
        const boxes = [];
        for (let i = 0; i < length; i++) {
            const digit = otp[i] || '';
            const isActive = focused && i === otp.length;
            
            boxes.push(
                <div
                    key={i}
                    className={`otp-box ${digit ? 'filled' : ''} ${isActive ? 'active' : ''} ${error ? 'error' : ''}`}
                    onClick={() => {
                        // Click vào box để focus input
                        if (inputRef.current) {
                            inputRef.current.focus();
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    {digit}
                </div>
            );
        }
        return boxes;
    };

    return (
        <div className="otp-input-container">
            <div className="otp-boxes">
                {renderOTPBoxes()}
            </div>
            <input
                ref={inputRef}
                type="text"
                value={otp}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                className="otp-hidden-input"
                maxLength={length}
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder=""
                aria-label="Nhập mã OTP"
            />
        </div>
    );
};

export default OTPInput; 