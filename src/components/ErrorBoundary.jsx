import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/30 text-center space-y-4 my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">Something went wrong in this view</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-lg transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry / Reset View</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
