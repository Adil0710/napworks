import * as React from "react";

interface TrashProps {
  className?: string;
  width?: number;
  height?: number;
}

const Trash = ({ className, width = 27, height = 27 }: TrashProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d="M6.5 5H18.5M9.5 5V5C11.0769 3.16026 13.9231 3.16026 15.5 5V5M9.5 20H15.5C16.6046 20 17.5 19.1046 17.5 18V9C17.5 8.44772 17.0523 8 16.5 8H8.5C7.94772 8 7.5 8.44772 7.5 9V18C7.5 19.1046 8.39543 20 9.5 20Z"
      stroke="#737373"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Trash;
