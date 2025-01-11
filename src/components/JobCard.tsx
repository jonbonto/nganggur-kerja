import Link from 'next/link';

type JobCardProps = {
  title: string;
  company: string;
  location: string;
  href: string;
};

const JobCard: React.FC<JobCardProps> = ({ title, company, location, href }) => {
  return (
    <Link href={href} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-1">{company}</p>
        <p className="text-gray-500">{location}</p>
    </Link>
  );
};

export default JobCard;
