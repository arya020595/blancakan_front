import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Compass, FileQuestion, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Main 404 Display */}
        <div className="relative">
          <div className="text-9xl font-black text-slate-200 dark:text-slate-700 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileQuestion className="h-24 w-24 text-slate-400 dark:text-slate-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Page Not Found
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into
            the digital wilderness.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Go Home
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Return to the homepage and start fresh
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Search
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Look for specific events or content
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                <Compass className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Explore
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Browse categories and discover events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button asChild className="group">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            If you believe this is an error, please{" "}
            <Link
              href="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              contact support
            </Link>{" "}
            or try refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}
