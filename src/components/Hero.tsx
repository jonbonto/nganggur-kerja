import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Connect with Top Talent or Your Next Gig</h1>
        <p className="text-xl mb-8">
          Whether you&apos;re looking to hire skilled freelancers or seeking your next big opportunity, we&apos;ve got you covered.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/jobs"
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold py-3 px-6 rounded-md transition"
          >
            Browse Jobs
          </Link>
          <Link
            href="/auth/signup"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Sign Up as Freelancer
          </Link>
          <Link
            href="/auth/signup?role=employer"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Hire Employees
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
