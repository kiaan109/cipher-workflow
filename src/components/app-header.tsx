import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-gray-100 px-4 bg-white">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
    </header>
  );
};
