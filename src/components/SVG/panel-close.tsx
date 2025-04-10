import * as React from "react";
interface PanelCloseProps {
  className?: string;
}
const PanelClose = ({ className }: PanelCloseProps) => (
  <svg
    width={22}
    height={18}
    viewBox="0 0 22 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 0H2C1.175 0 0.5 0.675 0.5 1.5V16.5C0.5 17.325 1.175 18 2 18H20C20.825 18 21.5 17.325 21.5 16.5V1.5C21.5 0.675 20.825 0 20 0ZM6.5 16.5H2V1.5H6.5V16.5ZM20 8.25H12.35L15.05 5.55L14 4.5L9.5 9L14 13.5L15.05 12.45L12.35 9.75H20V16.5H8V1.5H20V8.25Z"
      fill="#454545"
    />
  </svg>
);
export default PanelClose;
