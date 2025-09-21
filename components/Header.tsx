import Link from 'next/link'
import AuthButton from './AuthButton'

export default function Header() {
  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          AI Tools
        </Link>
        <nav className="flex items-center space-x-6 text-text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/compare" className="hover:text-primary transition-colors">
            Compare
          </Link>
          {/* This is our new dynamic component */}
          <AuthButton />
        </nav>
      </div>
    </header>
  )
}