import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/pipeline": "Pipeline Builder",
  "/settings": "Settings",
};

export function Header() {
  const location = useLocation();
  const title = titles[location.pathname] || "Convoye";

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--convoye-border)] px-6">
      <h1 className="text-base font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[var(--convoye-primary)] flex items-center justify-center text-sm font-medium text-white">
          R
        </div>
      </div>
    </header>
  );
}
