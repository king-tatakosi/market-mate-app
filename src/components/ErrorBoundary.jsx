import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="error-screen">
          <div className="error-screen__icon">⚠️</div>
          <h2 className="error-screen__title">Something went wrong</h2>
          <p className="error-screen__msg">The app hit an unexpected error.</p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
