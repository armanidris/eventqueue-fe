import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Page Not Found</p>
      <p className="mt-2 text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button className="mt-8">Go to Homepage</Button>
      </Link>
    </div>
  );
}
