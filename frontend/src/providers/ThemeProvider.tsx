import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuthStore();
    const [theme, setThemeState] = useState<Theme>(() => {
        // Initialize from user preferences or localStorage
        return (user?.theme as Theme) || (localStorage.getItem('theme') as Theme) || 'system';
    });

    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Sync theme with user preferences
        if (user?.theme) {
            setThemeState(user.theme as Theme);
        }
    }, [user?.theme]);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = (selectedTheme: Theme) => {
            let effectiveTheme: 'light' | 'dark' = 'light';

            if (selectedTheme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                effectiveTheme = systemTheme;
            } else {
                effectiveTheme = selectedTheme;
            }

            root.classList.remove('light', 'dark');
            root.classList.add(effectiveTheme);
            setActualTheme(effectiveTheme);
            localStorage.setItem('theme', theme);
        };

        applyTheme(theme);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}