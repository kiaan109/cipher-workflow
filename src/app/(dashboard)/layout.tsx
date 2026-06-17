import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AiAssistant } from "@/components/ai-assistant";

const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">
        {children}
      </SidebarInset>
      <AiAssistant />
    </SidebarProvider>
  );
};

export default Layout;
