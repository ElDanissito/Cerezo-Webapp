// src/app/dashboard/layout.tsx
import { SidebarProvider } from '@/features/admin/context/SidebarContext';
import { ThemeProvider } from '@/features/admin/context/ThemeContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Opción A: Providers SOLO para /dashboard
  return (
    <ThemeProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
  // Si prefieres, puedes quitar los providers de aquí y ponerlos globales en el root.
}
