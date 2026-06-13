import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = [
  { value: "light", icon: Sun,     label: "Light"  },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark",  icon: Moon,    label: "Dark"   },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-lg p-0.5 border bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-1.5 rounded-md transition-all ${
            theme === value
              ? "bg-white dark:bg-slate-600 text-amber-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          }`}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}
