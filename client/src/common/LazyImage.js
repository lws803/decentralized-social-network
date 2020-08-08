import React from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

import Placeholder from "../res/placeholder_round.png";

export default function LazyImage(props) {
  return (
    <LazyLoadImage
      {...props}
      effect="blur"
      placeholderSrc={Placeholder}
    />
  );
}
