import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeSelector() {
  const { theme, changeTheme } = useTheme();

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
        style={{
          borderColor: "var(--border-color)",
          color: "var(--text-secondary)",
          backgroundColor: "var(--bg-secondary)",
        }}
        title="Toggle theme"
      >
        {theme === "light" && <Sun size={14} />}
        {theme === "dark" && <Moon size={14} />}
        {theme === "system" && <Monitor size={14} />}
        <span className="hidden sm:inline capitalize">{theme}</span>
      </button>

      {/* Dropdown menu */}
      <div
        className="absolute right-0 mt-1 w-40 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => changeTheme(value)}
            className="w-full px-4 py-2 flex items-center gap-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors text-left"
            style={{
              color: theme === value ? "#c9a84c" : "var(--text-primary)",
            }}
          >
            <Icon size={14} />
            <span>{label}</span>
            {theme === value && (
              <span className="ml-auto text-xs">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
