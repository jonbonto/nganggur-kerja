type Props = {
    params: { id: string };
  };
  
  export default function JobDetails({ params }: Props) {
    const { id } = params;
  
    // Fetch job details using `id` if connected to backend
  
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-4">Job Title for ID: {id}</h1>
        <p>Details about the job will go here.</p>
      </div>
    );
  }
  