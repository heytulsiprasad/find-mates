import clsx from "clsx";
import React from "react";

const Paginator = ({
  page,
  totalPages,
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
      <p className="text-lg">
        Showing page {page} / {totalPages}
      </p>
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
