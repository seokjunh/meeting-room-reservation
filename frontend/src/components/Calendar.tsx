import { useNavigate } from "@tanstack/react-router";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  isSaturday,
  isSunday,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useCallback, useMemo, useState } from "react";
import CalendarIcon from "@/icons/CalendarIcon";
import NextIcon from "@/icons/NextIcon";
import PrevIcon from "@/icons/PrevIcon";
import Modal from "./Modal";

const Calendar = ({ roomName }: { roomName: string }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const weekMock = ["일", "월", "화", "수", "목", "금", "토"];
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const navigate = useNavigate();

  const createMonth = useMemo(() => {
    const monthArray = [];
    let day = startDate;
    while (differenceInCalendarDays(endDate, day) >= 0) {
      monthArray.push(day);
      day = addDays(day, 1);
    }
    return monthArray;
  }, [startDate, endDate]);

  const nextMonthHandler = useCallback(() => {
    setCurrentDate(addMonths(currentDate, 1));
  }, [currentDate]);

  const prevMonthHandler = useCallback(() => {
    setCurrentDate(subMonths(currentDate, 1));
  }, [currentDate]);

  const modalHandler = (date: Date) => {
    setIsOpenModal(true);
    setSelectDate(date);
  };

  return (
    <div className="h-screen w-full p-2 sm:p-4">
      <div className="flex h-full flex-col">
        <div className="flex flex-grow flex-col overflow-hidden rounded-2xl border border-blue-300">
          <div className="flex w-full items-center justify-between bg-blue-300 px-4 py-2 font-bold text-white">
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <div>월별 예약현황</div>
            </div>

            <select
              className="cursor-pointer focus:outline-none"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                e.target.value === "small"
                  ? navigate({ to: "/small-room" })
                  : navigate({ to: "/large-room" })
              }
            >
              <option value="" className="text-black">
                {roomName}
              </option>

              {roomName === "대회의실" ? (
                <option value="small" className="text-black">
                  소회의실
                </option>
              ) : (
                <option value="large" className="text-black">
                  대회의실
                </option>
              )}
            </select>
          </div>
          <div className="my-3 flex items-center justify-center gap-10">
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              onClick={prevMonthHandler}
            >
              <PrevIcon />
            </button>
            <div className="text-2xl font-bold text-gray-800">
              {format(currentDate, "yyyy년 M월")}
            </div>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              onClick={nextMonthHandler}
            >
              <NextIcon />
            </button>
          </div>

          <div className="grid grid-cols-7 border-t border-b border-gray-300 text-center text-sm font-medium text-gray-500">
            {weekMock.map((w, idx) => (
              <div key={w} className="py-2">
                <div
                  className={`${idx === 0 && "text-red-500"} ${
                    idx === 6 && "text-blue-500"
                  }`}
                >
                  {w}
                </div>
              </div>
            ))}
          </div>

          <div className="grid h-full grid-cols-7">
            {createMonth.map((date) => {
              const validation = getMonth(currentDate) === getMonth(date);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  className={`flex flex-col outline-none ${
                    validation
                      ? "cursor-pointer hover:bg-gray-200"
                      : "cursor-not-allowed bg-gray-200 opacity-60"
                  } `}
                  onClick={() => modalHandler(date)}
                >
                  <div
                    className={`relative flex items-center justify-end px-[0.4rem] py-1 font-semibold ${
                      isSunday(date)
                        ? "text-red-500"
                        : isSaturday(date)
                          ? "text-blue-500"
                          : "text-gray-800"
                    }`}
                  >
                    {isToday(date) && (
                      <div className="absolute inset-0 flex items-center justify-end">
                        <div className="h-8 w-8 rounded-full bg-blue-500 opacity-20" />
                      </div>
                    )}
                    <div>{format(date, "d")}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {isOpenModal && (
          <Modal
            setIsOpenModal={setIsOpenModal}
            selectDate={selectDate}
            roomName={roomName}
            isBefore={differenceInCalendarDays(
              startOfDay(currentDate),
              startOfDay(selectDate),
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
