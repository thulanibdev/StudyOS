import './globals.css'

export const metadata = {
  title: 'StudyOS — Your Student Dashboard',
  description: 'Tasks, flashcards, focus timer and notes — all in one place.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
