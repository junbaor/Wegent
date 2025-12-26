// SPDX-FileCopyrightText: 2025 Weibo, Inc.
//
// SPDX-License-Identifier: Apache-2.0

export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base text-text-primary p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-text-primary">You are offline</h1>
          <p className="text-sm text-text-secondary">
            It looks like you&apos;ve lost your internet connection. Some features may not be
            available.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <p className="text-sm text-text-secondary">Don&apos;t worry! You can still access:</p>
          <ul className="text-sm text-text-secondary space-y-2 text-left">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 text-primary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Previously loaded pages</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 text-primary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Cached content</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 mr-2 text-primary flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Basic navigation</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>

        <p className="text-xs text-text-muted">
          Your changes will be synced automatically when you reconnect.
        </p>
      </div>
    </div>
  );
}
