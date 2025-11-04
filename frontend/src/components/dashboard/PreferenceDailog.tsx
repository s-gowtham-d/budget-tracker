import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2, Save } from "lucide-react";

export const PreferenceDialog = ({
  open,
  onClose,
  preferences,
  setPreferences,
  handleSave,
  isUpdating,
}: {
  open: boolean;
  onClose: () => void;
  preferences: any;
  setPreferences: (val: any) => void;
  handleSave: () => Promise<void>;
  isUpdating: boolean;
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your Preferences</DialogTitle>
          <DialogDescription>
            Choose your preferred language and currency before continuing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={preferences.currency}
              onValueChange={(value) =>
                setPreferences({ ...preferences, currency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="inr">INR (₹)</SelectItem>
                <SelectItem value="jpy">JPY (¥)</SelectItem>
                <SelectItem value="cad">CAD (C$)</SelectItem>
                <SelectItem value="aud">AUD (A$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              disabled={isUpdating}
              onClick={async () => {
                await handleSave();
                onClose(); // close after saving
              }}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
