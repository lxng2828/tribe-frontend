const Loading = ({ size = 'medium', text = 'Đang tải...' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-16 w-16',
        xlarge: 'h-32 w-32'
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div
                className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}
            ></div>
            {text && (
                <p className="mt-2 text-sm text-gray-500">{text}</p>
            )}
        </div>
    );
};

export default Loading;
