import React from "react";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import Lottie from "lottie-react";
import SuccessLottie from "../../../public/assets/success.json";

export default function Toast({
  children,
  variant = "success",
}: {
  children: React.ReactNode;
  variant?: string;
}) {
  return (
    <div
      style={{
        boxShadow:
          "0px 21px 6px 0px rgba(186, 186, 186, 0.00), 0px 13px 5px 0px rgba(186, 186, 186, 0.01), 0px 7px 4px 0px rgba(186, 186, 186, 0.05), 0px 3px 3px 0px rgba(186, 186, 186, 0.09), 0px 1px 2px 0px rgba(186, 186, 186, 0.10)",
        fontSize: "14px",
      }}
      className="flex w-72 items-center gap-1.5 rounded-lg border border-[#F3F3F3] bg-white px-3 text-[#272727]"
    >
      {variant === "success" && (
        <Lottie
          style={{ width: 35, height: 35 }}
          animationData={SuccessLottie}
          loop={true}
        />
      )}
      {variant === "error" && (
        <ExclamationCircleIcon className="h-5 w-5 fill-[#A9333B]" />
      )}
      <h1
        style={{ width: "calc(100% - 10px)", fontSize: "14px", height: "fit" }}
        className="font-normal py-1"
      >
        {children}
      </h1>
    </div>
  );
}
