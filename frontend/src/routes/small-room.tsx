import { createFileRoute } from "@tanstack/react-router";
import Calendar from "@/components/Calendar";

export const Route = createFileRoute("/small-room")({
  component: () => <Calendar roomName="소회의실" />,
});
