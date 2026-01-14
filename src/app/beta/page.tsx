import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const BetaHome: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Find Your Dream Job or Perfect Freelancer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with opportunities that match your skills and aspirations
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/beta/jobs">
            <Button size="lg">Browse Jobs</Button>
          </Link>
          <Link href="/beta/auth/signup">
            <Button variant="outline" size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Technology', count: '1,234 jobs' },
            { title: 'Design', count: '856 jobs' },
            { title: 'Marketing', count: '642 jobs' },
            { title: 'Finance', count: '478 jobs' },
          ].map((category) => (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.count}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Senior Developer Position</CardTitle>
                <CardDescription>Tech Company Inc.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Remote • Full-time • $80k-$120k
                </p>
                <Link href={`/beta/jobs/${i}`}>
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30 rounded-lg px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Verified Jobs', description: 'All job postings are verified and legitimate' },
            { title: 'Easy Apply', description: 'Apply to jobs with just a few clicks' },
            { title: 'Career Growth', description: 'Access resources to grow your career' },
          ].map((feature) => (
            <div key={feature.title} className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 space-y-6">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Join thousands of job seekers and employers finding success
        </p>
        <Link href="/beta/auth/signup">
          <Button size="lg">Sign Up Now</Button>
        </Link>
      </section>
    </div>
  );
};

export default BetaHome;
