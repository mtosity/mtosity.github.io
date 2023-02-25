import React from "react";

import { Player } from "@lottiefiles/react-lottie-player";

import lottie from "./lottie.json";

interface Props {
  size?: number;
}

export const DogReading = ({ size }: Props) => (
  <Player
    autoplay
    loop
    src={lottie}
    style={{ height: size || 80, width: size || 80 }}
  ></Player>
);
