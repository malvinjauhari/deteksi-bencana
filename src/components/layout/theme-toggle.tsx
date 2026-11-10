import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/lib/storage/preferences";

const options: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Terang", icon: Sun },
  { value: "dark", label: "Gelap", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme, persistenceAvailable } = useTheme();

  return (
    <div>
      <div className="flex rounded-full border bg-surface-muted p-1" role="group" aria-label="Tema tampilan">
        {options.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant="ghost"
            size="icon"
            className={`size-9 min-h-9 ${theme === value ? "bg-surface shadow-sm" : "text-muted-foreground"}`}
            aria-label={`Tema ${label.toLowerCase()}`}
            aria-pressed={theme === value}
            title={`Tema ${label.toLowerCase()}`}
            onClick={() => setTheme(value)}
          >
            <Icon className="size-4" aria-hidden="true" />
          </Button>
        ))}
      </div>
      {!persistenceAvailable && (
        <p role="status" className="sr-only">Preferensi tema tidak dapat disimpan di browser ini.</p>
      )}
    </div>
  );
}
