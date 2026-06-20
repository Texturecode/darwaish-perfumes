import AdminSidebar from "@/components/admin/AdminSidebar";
import Topbar from "@/components/admin/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-4">
            <AdminSidebar />

            <div className="flex-1 flex flex-col gap-4">
                <Topbar title="Dashboard" />
                {children}
            </div>
        </div>
    )
}