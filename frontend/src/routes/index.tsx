import { createFileRoute } from "@tanstack/react-router";
import RoomSelectionCard from "@/components/RoomSelectionCard";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10">
      <div className="text-center text-4xl font-bold text-gray-800">
        예약하실 회의실을 선택해주세요.
      </div>

      <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-8">
        <RoomSelectionCard href="/large-room">대회의실</RoomSelectionCard>
        <RoomSelectionCard href="/small-room">소회의실</RoomSelectionCard>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
