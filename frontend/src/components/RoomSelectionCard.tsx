import { Link } from "@tanstack/react-router";

const RoomSelectionCard = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      to={href}
      className={`w-full rounded-3xl ${href === "/large-room" ? "bg-gradient-to-br from-blue-200 to-purple-300" : "bg-gradient-to-tr from-purple-300 to-blue-200"} p-30 text-center text-2xl font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      {children}
    </Link>
  );
};
export default RoomSelectionCard;
