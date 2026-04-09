import { NavLink } from "react-router-dom";
import { LayoutDashboard, GitBranch, Settings, Truck } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pipeline", icon: GitBranch, label: "Pipeline" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-[var(--convoye-border)] bg-[var(--convoye-surface)]">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--convoye-border)]">
        <Truck className="h-6 w-6 text-[var(--convoye-primary)]" />
        <span className="text-lg font-bold tracking-tight">Convoye</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--convoye-primary)]/10 text-[var(--convoye-primary)]"
                  : "text-[var(--convoye-text-muted)] hover:text-[var(--convoye-text)] hover:bg-white/5"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--convoye-border)] px-5 py-3">
        <p className="text-xs text-[var(--convoye-text-muted)]">Convoye v0.0.1</p>
      </div>
    </aside>
  );
}
