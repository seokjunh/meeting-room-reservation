import { format } from "date-fns";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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

const API_URL = import.meta.env.VITE_API_URL;

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
  isBefore,
}: {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  selectDate: Date;
  roomName: string;
  isBefore: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [reserved, setReserved] = useState<IResevation[]>([]);
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

    form.setValue("selectedTime", updated.sort());
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
      const response = await fetch(`${API_URL}/create`, {
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
      setIsOpenModal(false);
    } catch (error) {
      console.error("요청 중 오류 발생:", error);
      alert("요청 중 문제가 발생했습니다. 네트워크를 확인해주세요.");
    }
  };

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // 모달 바깥 클릭 시 닫기
    if (e.target === e.currentTarget) {
      setIsOpenModal(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpenModal(false);
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("keydown", handleEscape);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setIsOpenModal]);

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
        `${API_URL}/get?roomName=${roomName}&date=${formatSelectDate}`,
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("Fetch error:", text);
        return;
      }

      const result: IResevation[] = await response.json();

      setReserved(result);
      setReservedTimes((prev) => [
        ...prev,
        ...result.flatMap((v) => v.selectedTime),
      ]);
    };

    fetchData();
  }, [roomName, formatSelectDate]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={handleOutsideClick}
    >
      <div className="mx-auto flex w-[50rem] flex-col rounded-lg bg-white shadow-lg">
        <button
          type="button"
          className="cursor-pointer self-end"
          onClick={() => setIsOpenModal(false)}
        >
          <CloseIcon />
        </button>

        <div className="flex gap-4 px-8 py-4">
          <div className="flex w-[30%] flex-col gap-6">
            <div>
              <div className="text-gray-600">{formatSelectDate}</div>
              <div className="text-xl font-semibold text-gray-800">
                📅 {roomName} 예약 현황
              </div>
            </div>

            {reserved.length === 0 ? (
              <div className="text-gray-400">예약된 일정이 없습니다.</div>
            ) : (
              <ul className="scrollbar-hide h-[25.5rem] space-y-3 overflow-y-scroll">
                {reserved.map((reservation, _idx) => (
                  <div
                    key={reservation.topic}
                    className="rounded-md border border-gray-200 p-3 shadow-sm transition hover:shadow"
                  >
                    <div className="text-sm text-gray-600">
                      ⏰{" "}
                      <span className="font-medium">
                        {reservation.selectedTime.join(", ")}
                      </span>
                    </div>
                    <div className="mt-1 text-base font-semibold text-gray-800">
                      {reservation.topic}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      👥 {reservation.attendees.join(", ")}
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
          <div className="w-[70%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex self-end">
                  <button
                    type="submit"
                    disabled={isBefore > 0}
                    className="cursor-pointer rounded-lg bg-blue-300 px-4 py-2 text-white hover:bg-blue-300/90 disabled:pointer-events-none"
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
                            disabled={isBefore > 0}
                            className="rounded-md border px-3 py-2 disabled:border-gray-300"
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
                            disabled={isBefore > 0}
                            className="rounded-md border px-3 py-2 disabled:border-gray-300"
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
                        isBefore={isBefore}
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
      </div>
    </div>
  );
};
export default Modal;
