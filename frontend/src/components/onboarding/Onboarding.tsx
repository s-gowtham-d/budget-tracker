import { useAuthStore } from "@/store/authStore";
import { WelcomeOnboardingModal } from "./WelcomeOnboardingModal";
import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";


export function Onboarding() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { setTheme } = useTheme();

      const { updateProfile } = userAPI;
  
  useEffect(() => {
            const shouldShow =
                localStorage.getItem("showOnboarding") === "true" || !user?.currency;

            if (isAuthenticated && shouldShow) {
                setShowOnboarding(true);
                localStorage.removeItem("showOnboarding");
            }
    }, [user, isAuthenticated]);

    const handleOnboardingComplete = async (preferences: any) => {
        setIsUpdating(true);
        try {
            setTheme(preferences.theme);
            const response = await updateProfile(preferences);
            setUser(response.data);
            toast.success("Preferences saved successfully!");
            setShowOnboarding(false);
        } catch (error) {
            toast.error("Failed to save preferences");
        } finally {
            setIsUpdating(false);
        }
    };

  return (
    
       <WelcomeOnboardingModal
                      open={showOnboarding}
                      onClose={() => setShowOnboarding(false)}
                      onComplete={handleOnboardingComplete}
                      isUpdating={isUpdating}
                      userName={user?.first_name}
                  />
     
  );
}
