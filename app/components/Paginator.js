import clsx from "clsx";
import React from "react";

const Paginator = ({
  handleNext,
  handlePrevious,
  nextDisabled,
  prevDisabled,
}) => {
  return (
    <div className="w-full flex items-center justify-between">
      <button
        className={clsx("btn btn-primary", prevDisabled && "btn-disabled")}
        onClick={handlePrevious}
      >
        Previous
      </button>
      <button
        className={clsx("btn btn-primary", nextDisabled && "btn-disabled")}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default Paginator;
