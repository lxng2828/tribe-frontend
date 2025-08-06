const Button = ({ children, variant = 'primary', size = 'md', onClick, disabled = false, ...props }) => {
    const baseClasses = 'btn focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium rounded-lg text-sm px-5 py-2.5 text-center';

    const variants = {
        primary: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300',
        secondary: 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200',
        danger: 'text-white bg-red-700 hover:bg-red-800 focus:ring-red-300',
        success: 'text-white bg-green-700 hover:bg-green-800 focus:ring-green-300'
    };

    const sizes = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
