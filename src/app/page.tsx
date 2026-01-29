import { auth } from "@/auth";
import { redirect } from "next/navigation";
import TopicList from "@/components/TopicList";
import AuthGuard from "@/components/AuthGuard";
import { Server, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  console.log("Dashboard Page - Session:", session);

  if (!session) {
    console.log("Dashboard Page - No session, redirecting to /login");
    redirect("/login");
  }

  return (
    <AuthGuard>
      <div className="space-y-8 animate-fadeIn">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e0e0e0] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#002147] rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#002147]">Service Bus Dashboard</h1>
                <p className="text-[#666666]">Monitor and manage your Azure Service Bus topics and subscriptions</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[#666666]">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Connected</span>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <TopicList />
      </div>
    </AuthGuard>
  );
}
