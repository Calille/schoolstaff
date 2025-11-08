import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">School Staff</h3>
            <p className="text-sm text-gray-600">
              Connecting schools with qualified staff members.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Schools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/for-schools" className="text-gray-600 hover:text-gray-900">
                  Find Staff
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Staff</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/for-staff" className="text-gray-600 hover:text-gray-900">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 hover:text-gray-900">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} School Staff. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

