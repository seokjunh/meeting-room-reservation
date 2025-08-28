import { createFileRoute } from "@tanstack/react-router";
import Calendar from "@/components/Calendar";

export const Route = createFileRoute("/large-room")({
  component: () => <Calendar roomName="대회의실" />,
});
