import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AiAssistant } from "@/components/ai-assistant";

const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <div className="dark h-full min-h-dvh">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background">
          {children}
        </SidebarInset>
        <AiAssistant />
      </SidebarProvider>
    </div>
  );
};

export default Layout;
