# StudyOS

A student productivity dashboard for tasks, notes, flashcards and focused study.

[Live demo](https://study-os-swart.vercel.app/) · [Source](https://github.com/thulanibdev/StudyOS)

## Features

Task management, notes, flashcard decks and a Pomodoro timer.

The timer uses elapsed wall-clock time so delayed browser intervals do not add time to a session. Completed focus sessions are recorded once.

## Stack and data

Next.js 14, React, Tailwind CSS and browser localStorage.

Browser-stored data belongs to the current browser profile. It does not sync to a user account, and clearing site data removes it. This is a portfolio project in ongoing development.

## Run locally

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No API credentials are needed.

## Verification

```bash
npm test
npm run build
```

The tests cover the project's persistence or business logic and error cases. They do not validate third-party services or prove that every live-demo feature works.

## Development priorities

Improve accessibility, document design decisions and add integration coverage as the project develops. Keep secret keys in local environment configuration and out of Git.
