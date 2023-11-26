import { SidebarRoutes } from "./sidebar-routes";

// Az oldalsáv (Sidebar) komponens definíciója
export const Sidebar = () => {
  return (
    // A komponens fő konténere
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      {/* Felső rész, lehetne itt valamilyen tartalom */}
      <div className="p-6"></div>

      {/* Navigációs útvonalakat tartalmazó rész */}
      <div className="flex flex-col w-full">
        {/* A SidebarRoutes komponens, amely valószínűleg a navigációs útvonalakat jeleníti meg */}
        <SidebarRoutes />
      </div>
    </div>
  );
};
