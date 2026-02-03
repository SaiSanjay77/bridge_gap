"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

export function DashboardMonitor({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Play sound helper
    const playNotificationSound = () => {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    };

    const channel = supabase
      .channel("public:help_requests")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "help_requests",
          filter: "status=eq.pending",
        },
        // Fixed: Added explicit type for the payload to satisfy the TypeScript compiler
        (payload: RealtimePostgresInsertPayload<any>) => {
          console.log("New request!", payload);
          playNotificationSound();
          toast.info("New Senior Needs Help!", {
            description: "A senior just requested assistance.",
            action: {
              label: "View",
              onClick: () => router.push("/buddy/requests"),
            },
            duration: 5000,
          });
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return null;
}