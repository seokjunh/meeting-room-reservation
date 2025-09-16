const TimeButton = ({
  time,
  selectedTime,
  reservedTimes,
  isBefore,
  onMouseDown,
  onMouseEnter,
}: {
  time: string;
  selectedTime: string[];
  reservedTimes: string[];
  isBefore: number;
  onMouseDown: () => void;
  onMouseEnter: () => void;
}) => {
  return (
    <button
      key={time}
      type="button"
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={`py-2 text-xl ${reservedTimes.includes(time) || isBefore > 0 ? "pointer-events-none cursor-not-allowed bg-gray-200" : "cursor-pointer hover:bg-amber-100"} ${selectedTime.includes(time) && "bg-gray-200"}`}
    >
      {time}
    </button>
  );
};
export default TimeButton;
