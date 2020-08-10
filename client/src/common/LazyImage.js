import React from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

export default function LazyImage(props) {
  return (
    <LazyLoadImage
      {...props}
      effect="opacity"
    />
  );
}
