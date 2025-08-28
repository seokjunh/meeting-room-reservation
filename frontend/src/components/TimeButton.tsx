const TimeButton = ({
  time,
  selectedTime,
  reservedTimes,
  onMouseDown,
  onMouseEnter,
}: {
  time: string;
  selectedTime: string[];
  reservedTimes: string[];
  onMouseDown: () => void;
  onMouseEnter: () => void;
}) => {
  return (
    <button
      key={time}
      type="button"
      disabled={reservedTimes.includes(time)}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className={`cursor-pointer py-2 text-xl ${selectedTime.includes(time) ? "bg-gray-200" : "hover:bg-amber-100"} disabled:cursor-not-allowed disabled:bg-gray-200`}
    >
      {time}
    </button>
  );
};
export default TimeButton;
