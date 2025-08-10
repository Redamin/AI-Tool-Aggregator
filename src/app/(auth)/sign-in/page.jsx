import { getServerSession } from "next-auth/next";
import { authConfig } from "@/src/lib/auth";
import SignInForm from "@/src/components/form/SignInForm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";

const page = async () => {
  const session = await getServerSession(authConfig);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or use the demo admin credentials below
          </p>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Demo Admin Access</CardTitle>
            <CardDescription>
              Use these credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium text-gray-700">Email: admin@demo.com</p>
              <p className="text-sm font-medium text-gray-700">Password: admin123456</p>
            </div>
          </CardContent>
        </Card>

        <SignInForm />
      </div>
    </div>
  );
};

export default page;