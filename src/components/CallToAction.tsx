import Link from 'next/link';

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8">
          Join thousands of freelancers and employers who are succeeding on our platform.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/signup"
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold py-3 px-6 rounded-md transition"
          >
            Sign Up as Freelancer
          </Link>
          <Link
            href="/signup"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-md transition"
          >
            Hire Employers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
