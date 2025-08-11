import { useState, useRef, useEffect } from 'react';

const useOTPInput = (length = 6) => {
    const [otp, setOtp] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Chỉ cho phép số
        console.log('useOTPInput - handleChange:', e.target.value, '->', value);
        if (value.length <= length) {
            setOtp(value);
        }
        // Auto-focus nếu chưa focus
        if (!focused) {
            setFocused(true);
        }
    };

    const handleKeyDown = (e) => {
        // Cho phép: backspace, delete, tab, escape, enter
        if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
            // Cho phép Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Cho phép home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Đảm bảo rằng nó là một số và ngăn chặn keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
        if (pastedData.length <= length) {
            setOtp(pastedData);
        } else {
            setOtp(pastedData.slice(0, length));
        }
    };

    const handleFocus = () => {
        console.log('useOTPInput - focus');
        setFocused(true);
    };

    const handleBlur = () => {
        console.log('useOTPInput - blur');
        setFocused(false);
    };

    const clearOTP = () => {
        setOtp('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const isComplete = otp.length === length;

    return {
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
    };
};

export default useOTPInput; 