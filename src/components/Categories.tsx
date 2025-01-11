import Link from 'next/link';

const categories = [
  { name: 'Development', icon: '💻', href: '/jobs?category=development' },
  { name: 'Design', icon: '🎨', href: '/jobs?category=design' },
  { name: 'Marketing', icon: '📈', href: '/jobs?category=marketing' },
  { name: 'Writing', icon: '✍️', href: '/jobs?category=writing' },
  { name: 'Finance', icon: '💰', href: '/jobs?category=finance' },
  { name: 'Support', icon: '🛠️', href: '/jobs?category=support' },
];

const Categories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Job Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              href={category.href}
              key={category.name}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-lg font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
