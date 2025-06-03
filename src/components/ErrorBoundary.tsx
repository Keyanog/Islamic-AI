import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styled from '@emotion/styled';

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  color: #b71c1c;
`;

const ErrorHeading = styled.h2`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 1rem;
`;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <ErrorMessage>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </ErrorMessage>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 