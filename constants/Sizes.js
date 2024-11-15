import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const radius = 10;

export const lignHeight1 = 32;
export const lignHeight2 = 24;
export const lignHeight3 = 20;

export const screenHeight = (percent) => hp(percent);
export const screenWidth = (percent) => wp(percent);
export const resFontSize = (size) => RFPercentage(size);
export const fontSize10 = resFontSize(1.2);
export const fontSize12 = resFontSize(1.4);
export const fontSize14 = resFontSize(1.6);
export const fontSize16 = resFontSize(1.9);
export const fontSize18 = resFontSize(2.1);
export const fontSize20 = resFontSize(2.3);
export const fontSize22 = resFontSize(2.6);
export const fontSize24 = resFontSize(2.8);
export const fontSize26 = resFontSize(3);
export const fontSize28 = resFontSize(3.3);
export const fontSize30 = resFontSize(3.5);
export const fontSize32 = resFontSize(3.8);
export const fontSize34 = resFontSize(4);
export const fontSize36 = resFontSize(4.3);

export const compPadding = screenWidth("4%");

export const Size4 = screenWidth("1.1%");
export const Size8 = screenWidth("2%");
export const Size10 = screenWidth("2.6%");
export const Size14 = screenWidth("3.6%");
export const Size16 = screenWidth("3.7%");
export const Size17 = screenWidth("4%");
export const Size18 = screenWidth("4.6%");
export const lignHeight20 = screenWidth("4.7%");
export const lignHeight21 = screenWidth("4.9%");
export const lignHeight22 = screenWidth("5.2%");
export const lignHeight23 = screenWidth("5.4%");
export const lignHeight24 = screenWidth("5.5%");
export const lignHeight26 = screenWidth("6.1%");
export const lignHeight27 = screenWidth("6.3%");
export const lignHeight28 = screenWidth("6.5%");
export const lignHeight29 = screenWidth("6.8%");
export const lignHeight30 = screenWidth("7%");
export const lignHeight32 = screenWidth("7.5%");
export const lignHeight34 = screenWidth("8%");
export const lignHeight38 = screenWidth("9%");
export const lignHeight43 = screenWidth("10%");
export const lignHeight47 = screenWidth("11%");
export const lignHeight51 = screenWidth("12%");
export const lignHeight53 = screenWidth("12.3%");
export const lignHeight56 = screenWidth("13%");
export const lignHeight57 = screenWidth("13.3%");
export const lignHeight60 = screenWidth("14%");
export const lignHeight72 = screenWidth("16.8%");

export const SIZES = {
  // global sizes
  base: width * 0.03,
  base1: width * 0.02,
  base2: width * 0.01,
  font: 14,
  radius: 30,
  padding: width * 0.03,
  padding2: width * 0.05,

  // font sizes
  largeTitle: width * 0.14,
  mediumTitle: width * 0.1,
  h1: width * 0.08,
  h2: width * 0.065,
  h3: width * 0.055,
  h4: width * 0.045,
  h5: width * 0.03,
  h6: width * 0.026,
  h7: width * 0.02,
  // app dimensions
  width,
  height,
};

export const radius1 = SIZES.base * 2;
