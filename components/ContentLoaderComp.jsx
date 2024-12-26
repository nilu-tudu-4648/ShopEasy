import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { compPadding, screenHeight, screenWidth } from '@/constants/Sizes';
import ContentLoader, { Rect } from "react-native-content-loader";

const ContentLoaderComp = ({
  height = "100%",
  width = "100%", 
  radius = "15",
}) => {
  return (
    <ContentLoader
      width={width}
      height={height}
      backgroundColor="#f5f5f5"
      foregroundColor="#dbdbdb"
    >
      <Rect x="0" y="0" rx={radius} ry={radius} width="100%" height={"100%"} />
    </ContentLoader>
  );
};

const ContentListLoader = ({count}) => {
  return (
    <View style={{ flex: 1, gap: compPadding, alignItems: "center" }}>
      {[...Array(count)].map((ele, index) => {
        return (
          <View
            key={index}
            style={{ height: screenHeight("10%"), width: screenWidth("90%") }}
          >
            <ContentLoaderComp />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});

export { ContentLoaderComp, ContentListLoader };
