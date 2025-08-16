import { Component, ReactNode } from 'react';

export class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: any) { console.error('[ErrorBoundary]', err); }
  render() {
    return this.state.hasError ? <div className="text-red-600">Something went wrong. Refresh to continue.</div> : this.props.children;
  }
}
