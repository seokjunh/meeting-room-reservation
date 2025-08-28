import { format } from "date-fns";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CloseIcon from "@/icons/CloseIcon";
import TimeButton from "./TimeButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface IResevation {
  _id: string;
  roomName: string;
  topic: string;
  attendees: string[];
  selectedTime: string[];
  date: string;
}

const times = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const formSchema = z.object({
  roomName: z.string(),
  topic: z.string().min(2, "주제를 입력하세요."),
  attendees: z.string().min(2, "참석자를 입력하세요."),
  selectedTime: z.array(z.string()).min(1, "시간을 선택해주세요"),
});

const Modal = ({
  setIsOpenModal,
  selectDate,
  roomName,
}: {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  selectDate: Date;
  roomName: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [reservedTimes, setReservedTimes] = useState<string[]>([]);
  const formatSelectDate = format(selectDate, "yyyy년 MM월 d일");
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      roomName: roomName,
      topic: "",
      attendees: "",
      selectedTime: [],
    },
  });
  const selectedTime = form.watch("selectedTime");

  const toggleTime = (time: string) => {
    const updated = selectedTime.includes(time)
      ? selectedTime.filter((t) => t !== time)
      : [...selectedTime, time];

    form.setValue("selectedTime", updated);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const parsedData = {
      ...data,
      attendees: data.attendees
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== ""),
      date: formatSelectDate,
    };

    try {
      const response = await fetch("http://localhost:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("작성 실패:", errorMessage);
        alert("작성에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      alert("성공적으로 작성되었습니다!");
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
      alert("요청 중 문제가 발생했습니다. 네트워크를 확인해주세요.");
    }
  };

  useEffect(() => {
    const mouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", mouseUp);

    return () => {
      window.removeEventListener("mouseup", mouseUp);
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8000/get?roomName=${roomName}&date=${formatSelectDate}`,
      );

      const result: IResevation[] = await response.json();

      const reserved = result.flatMap((v) => v.selectedTime);

      setReservedTimes(reserved);
    };

    fetchData();
  }, [roomName, formatSelectDate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="flex w-[30rem] flex-col bg-white">
        <button
          type="button"
          className="cursor-pointer self-end overflow-hidden hover:bg-gray-300"
          onClick={() => setIsOpenModal(false)}
        >
          <CloseIcon />
        </button>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 px-8 py-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-gray-800">
                  회의실 예약 현황
                </div>
                <div className="text-gray-600">{formatSelectDate}</div>
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-white hover:bg-blue-300/90"
              >
                예약하기
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>회의명</FormLabel>
                    <FormControl>
                      <input
                        className="rounded-md border px-3 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>참석자</FormLabel>
                    <FormControl>
                      <input
                        placeholder="쉼표(,)로 구분하여 입력하세요."
                        className="rounded-md border px-3 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>시간을 선택하세요.</div>
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-gray-200" />
                  <div>예약 불가</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {times.map((time) => (
                  <TimeButton
                    key={time}
                    time={time}
                    selectedTime={selectedTime}
                    reservedTimes={reservedTimes}
                    onMouseDown={() => {
                      setIsDragging(true);
                      toggleTime(time);
                    }}
                    onMouseEnter={() => {
                      if (isDragging) toggleTime(time);
                    }}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="selectedTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};
export default Modal;
