"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { verifyBuddy } from "../../actions"; 
export function VerifyButton() {
  const [loading, setLoading] = useState(false);
  const handleVerify = async () => {
    setLoading(true);
    try {
        // Updated: Calling without arguments if your action handles auth internally
        // or ensure buddyId matches the action signature.
        await verifyBuddy(); 
        toast.success("Verification request sent!");
    } catch (e) {
        toast.error("Failed to send verification.");
    } finally {
        setLoading(false);
    }
  };
  return (
    <Button 
      onClick={handleVerify} 
      disabled={loading}
      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
    >
      {loading ? "Sending..." : "Verify Now"}
    </Button>
  );
}