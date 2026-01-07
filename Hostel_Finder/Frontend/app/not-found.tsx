import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-primary">404</h1>
                    <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg">
                            Go to Homepage
                        </Button>
                    </Link>
                    <Link href="/hostels">
                        <Button size="lg" variant="outline">
                            Browse Hostels
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
