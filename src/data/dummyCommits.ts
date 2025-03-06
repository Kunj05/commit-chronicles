
import { Commit } from '../types';

const dummyCommits: Commit[] = [
  {
    sha: 'abc123',
    commit: {
      author: {
        name: 'John Doe',
        date: '2025-03-07T14:45:00Z',
      },
      message: 'Fix bug in authentication flow',
    },
    files: [
      { filename: 'auth.js' },
      { filename: 'login.js' },
    ],
  },
  {
    sha: 'def456',
    commit: {
      author: {
        name: 'Jane Smith',
        date: '2025-03-06T10:20:00Z',
      },
      message: 'Add user profile page',
    },
    files: [
      { filename: 'profile.js' },
      { filename: 'profile.css' },
    ],
  },
  {
    sha: 'ghi789',
    commit: {
      author: {
        name: 'Alice Johnson',
        date: '2025-03-05T16:30:00Z',
      },
      message: 'Refactor homepage layout',
    },
    files: [
      { filename: 'index.html' },
      { filename: 'style.css' },
    ],
  },
  {
    sha: 'jkl012',
    commit: {
      author: {
        name: 'Bob Brown',
        date: '2025-03-04T12:15:00Z',
      },
      message: 'Update readme documentation',
    },
    files: [
      { filename: 'README.md' },
    ],
  },
  {
    sha: 'mno345',
    commit: {
      author: {
        name: 'Charlie Williams',
        date: '2025-03-03T08:00:00Z',
      },
      message: 'Initial commit',
    },
    files: [
      { filename: 'index.js' },
      { filename: 'style.css' },
      { filename: 'app.js' },
    ],
  },
];

export default dummyCommits;
