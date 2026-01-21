import type { Metadata } from "next";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Job Board & Freelance Marketplace - Beta',
  description: 'Beta version with shadcn UI components for A/B testing.',
};

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Beta Navigation Bar */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/beta" className="text-2xl font-bold">
            JobBoard <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">BETA</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/beta">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/beta/jobs">
              <Button variant="ghost">Jobs</Button>
            </Link>
            <Link href="/beta/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/beta/auth/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/beta/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {children}

      {/* Beta Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                Connect freelancers with job opportunities. Beta version with enhanced UI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/beta/jobs" className="text-muted-foreground hover:text-foreground">Browse Jobs</Link></li>
                <li><Link href="/beta/auth/signup" className="text-muted-foreground hover:text-foreground">Sign Up</Link></li>
                <li><Link href="/beta/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Beta Testing</h3>
              <p className="text-sm text-muted-foreground">
                This is a beta version for A/B testing. <Link href="/" className="text-primary hover:underline">Switch to original</Link>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Job Board & Freelance Marketplace. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
