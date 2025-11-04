import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
    Loader2,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Wallet,
    BarChart3,
    PiggyBank,
    ArrowLeftRight,
    Sun,
    Moon,
    Monitor,
    CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeOnboardingModalProps {
    open: boolean;
    onClose: () => void;
    onComplete: (preferences: OnboardingPreferences) => Promise<void>;
    isUpdating: boolean;
    userName?: string;
}

interface OnboardingPreferences {
    currency: string;
    language: string;
    theme: "light" | "dark" | "system";
}

const steps = [
    { id: 1, title: "Welcome" },
    { id: 2, title: "App Overview" },
    { id: 3, title: "Preferences" },
];

export const WelcomeOnboardingModal = ({
    open,
    onClose,
    onComplete,
    isUpdating,
    userName = "there",
}: WelcomeOnboardingModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { setTheme } = useTheme();
    const [preferences, setPreferences] = useState<OnboardingPreferences>({
        currency: "inr",
        language: "en",
        theme: "system",
    });

    const handleNext = () => {
        if (currentStep < steps.length) setCurrentStep((s) => s + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const handleComplete = async () => {
        setTheme(preferences.theme);
        await onComplete(preferences);
        onClose();
    };

    const handleThemeChange = (theme: "light" | "dark" | "system") => {
        setPreferences({ ...preferences, theme });
        setTheme(theme);
    };

    return (
        <Dialog
            open={open}
            // 🔒 Disable closing by clicking outside or pressing ESC
            onOpenChange={(openState) => {
                if (currentStep === steps.length && !isUpdating) {
                    if (!openState) onClose();
                }
            }}
        >
            <DialogContent
                className="sm:max-w-lg rounded-2xl p-0 overflow-hidden bg-background shadow-xl border"
                onInteractOutside={(e) => e.preventDefault()} // 🔒 Prevent closing when clicking outside
                onEscapeKeyDown={(e) => e.preventDefault()} // 🔒 Prevent ESC close
            >
                <style>{`
                    [data-slot="dialog-close"] {
                        display: none !important;
                    }
                    `}</style>
                <div className="flex flex-col items-center justify-center py-6 px-6 text-center">
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === step.id
                                    ? "bg-primary text-primary-foreground"
                                    : currentStep > step.id
                                        ? "bg-emerald-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {currentStep > step.id ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full space-y-6"
                            >
                                <DialogHeader>
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full">
                                            <Sparkles className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                    <DialogTitle className="text-2xl font-bold">
                                        Welcome, {userName}! 🎉
                                    </DialogTitle>
                                    <DialogDescription className="mt-2 text-muted-foreground">
                                        Let’s personalize your Budget Tracker experience.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex justify-center">
                                    <Button onClick={handleNext} size="lg">
                                        Get Started <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full space-y-5"
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold">
                                        Explore Your Dashboard
                                    </DialogTitle>
                                    <DialogDescription>
                                        Quick overview of what you can do 👇
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { icon: Wallet, label: "Dashboard" },
                                        { icon: ArrowLeftRight, label: "Transactions" },
                                        { icon: PiggyBank, label: "Budgets" },
                                        { icon: BarChart3, label: "Analytics" },
                                    ].map(({ icon: Icon, label }) => (
                                        <Card
                                            key={label}
                                            className="flex flex-col items-center justify-center p-4 hover:shadow-md transition-all cursor-pointer border border-muted"
                                        >
                                            <Icon className="h-6 w-6 mb-2 text-primary" />
                                            <p className="text-sm font-medium">{label}</p>
                                        </Card>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button onClick={handleBack} variant="outline">
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <Button onClick={handleNext}>
                                        Continue <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full space-y-6"
                            >
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold">
                                        Set Your Preferences
                                    </DialogTitle>
                                    <DialogDescription>
                                        Customize how you want things to look and feel.
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Theme Selection */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { theme: "light", icon: Sun, label: "Light" },
                                        { theme: "dark", icon: Moon, label: "Dark" },
                                        { theme: "system", icon: Monitor, label: "System" },
                                    ].map(({ theme, icon: Icon, label }) => (
                                        <button
                                            key={theme}
                                            onClick={() => handleThemeChange(theme as any)}
                                            className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${preferences.theme === theme
                                                ? "border-primary bg-primary/5"
                                                : "border-muted hover:border-primary/40"
                                                }`}
                                        >
                                            <Icon className="h-5 w-5 mb-1" />
                                            <span className="text-sm font-medium">{label}</span>
                                            {preferences.theme === theme && (
                                                <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Currency & Language */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col">
                                        <Label htmlFor="pref-currency">Currency</Label>
                                        <Select
                                            value={preferences.currency}
                                            onValueChange={(v) => setPreferences({ ...preferences, currency: v })}
                                        >
                                            <SelectTrigger id="pref-currency" className="w-full h-11">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="usd">USD ($)</SelectItem>
                                                <SelectItem value="eur">EUR (€)</SelectItem>
                                                <SelectItem value="inr">INR (₹)</SelectItem>
                                                <SelectItem value="gbp">GBP (£)</SelectItem>
                                                <SelectItem value="jpy">JPY (¥)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col">
                                        <Label htmlFor="pref-language">Language</Label>
                                        <Select
                                            value={preferences.language}
                                            onValueChange={(v) => setPreferences({ ...preferences, language: v })}
                                        >
                                            <SelectTrigger id="pref-language" className="w-full h-11">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">🇺🇸 English</SelectItem>
                                                <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                                                <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                                                <SelectItem value="fr">🇫🇷 French</SelectItem>
                                                <SelectItem value="de">🇩🇪 German</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button onClick={handleBack} variant="outline">
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                    </Button>
                                    <Button
                                        onClick={handleComplete}
                                        disabled={isUpdating}
                                        size="lg"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                Complete Setup{" "}
                                                <CheckCircle2 className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};
