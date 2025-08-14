import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="alert alert-danger m-3">
                    <h5>Đã xảy ra lỗi</h5>
                    <p>Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại.</p>
                    <button 
                        className="btn btn-outline-danger"
                        onClick={this.handleRetry}
                    >
                        Thử lại
                    </button>
                    <details className="mt-3">
                        <summary>Chi tiết lỗi</summary>
                        <pre className="mt-2 small text-muted">
                            {this.state.error?.toString()}
                        </pre>
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

