import React from "react";
import ReviewsBusinessLogic from "./Logic";
import ReviewsView from "./View";

const Reviews = (props) => {
  return (
    <ReviewsBusinessLogic {...props}>
      {(serviceProps) => <ReviewsView {...serviceProps} />}
    </ReviewsBusinessLogic>
  );
};

export default Reviews;
