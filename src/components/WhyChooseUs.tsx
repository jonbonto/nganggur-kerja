const reasons = [
    { title: 'Trusted Platform', description: 'Connecting verified freelancers with reputable employers.', icon: '🔒' },
    { title: 'Secure Payments', description: 'Safe and reliable payment processing for every transaction.', icon: '💳' },
    { title: '24/7 Support', description: 'Dedicated support team to assist you anytime.', icon: '🛠️' },
    { title: 'Easy Communication', description: 'Seamless messaging and collaboration tools.', icon: '💬' },
  ];
  
  const WhyChooseUs: React.FC = () => {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
                <span className="text-4xl mb-4">{reason.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-center text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default WhyChooseUs;
  