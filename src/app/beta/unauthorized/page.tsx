import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BetaUnauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-destructive">Unauthorized</CardTitle>
          <CardDescription className="text-lg mt-4">
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/beta">
            <Button className="w-full">Go Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetaUnauthorized;
