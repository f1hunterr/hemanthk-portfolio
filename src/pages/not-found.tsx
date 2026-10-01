import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has moved.
          </p>
          <a
            href={import.meta.env.BASE_URL}
            className="inline-block mt-6 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-85 transition-opacity"
            style={{ backgroundColor: "var(--portfolio-navy)" }}
          >
            Back to home
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
