import Image from "next/image";

const testimonials = [
    {
      name: 'Jane Doe',
      role: 'Freelancer',
      feedback: 'This platform helped me find amazing clients and grow my freelance business!',
      avatar: '/avatars/jane.jpg',
    },
    {
      name: 'John Smith',
      role: 'Employer',
      feedback: 'Finding skilled professionals has never been easier. Highly recommended!',
      avatar: '/avatars/john.jpg',
    },
    {
      name: 'Alice Johnson',
      role: 'Freelancer',
      feedback: 'The secure payment system gives me peace of mind when working on projects.',
      avatar: '/avatars/alice.jpg',
    },
  ];
  
  const Testimonials: React.FC = () => {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
                <Image src={testimonial.avatar} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4" width={300} height={300} />
                <p className="text-center text-gray-700 mb-2">&quot;{testimonial.feedback}&quot;</p>
                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  