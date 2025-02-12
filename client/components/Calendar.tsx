import React, { useState, useEffect } from "react";
import { StyleSheet, LayoutChangeEvent, Pressable } from "react-native";
import { Link } from "expo-router";
import { Text, View, Button, Title, useThemeColor } from "./Themed";
import Colors from "@/constants/Colors";
import { universalStyles } from "@/constants/Styles";
import { Icon } from "./Icon";
import { Alert } from "react-native";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";

interface CalendarProps {
  title: string;
}

interface DateCardProps {
  date: Date;
  setImage: (date: string) => void;
}

const getDate = (date: Date) => {
  const formattedDate = `${date.getDate()}`;
  return formattedDate.toString();
};

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return "th"; // covers 11th, 12th, 13th, etc.
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDateWithSuffix = (date: Date) => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const DateCard: React.FC<DateCardProps> = ({ date, setImage }) => {
  const currentDate = new Date();
  const isCurrentDate = date.toDateString() === currentDate.toDateString();

  const themeColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, isCurrentDate ? "tint" : "accentBackground");
  const textColor = isCurrentDate ? "white" : themeColor;

  return (
    <Pressable
      onPressIn={() => {
        setImage(date.toString());
      }}
    >
      <View style={styles.dateCard} lightColor={backgroundColor} darkColor={backgroundColor}>
        <Text style={styles.dateText} lightColor={textColor} darkColor="#fff" fontWeight="700">
          {getDate(date)}
        </Text>
      </View>
    </Pressable>
  );
};

const Calendar: React.FC<CalendarProps> = ({ title }) => {
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateCardWidth, setDateCardWidth] = useState<number>(0);
  const [image, setImage] = useState<MediaLibrary.Asset | null>(null);

  const today = new Date();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  };

  const dates = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const fetchImage = async (date: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        const album = await MediaLibrary.getAlbumAsync("SCC");
        if (album) {
          const assets = await MediaLibrary.getAssetsAsync({
            album: album,
            sortBy: [[MediaLibrary.SortBy.creationTime, false]],
            mediaType: [MediaLibrary.MediaType.photo],
          });

          const compareDate = new Date(date).toISOString().split("T")[0];
          const imageAsset = assets.assets.find((asset) => {
            const assetDate = new Date(asset.creationTime);
            const assetDateString = assetDate.toISOString().split("T")[0];
            return assetDateString === compareDate;
          });

          if (imageAsset) {
            console.log("set image");
            console.log(imageAsset);
            setImage(imageAsset);
          } else {
            console.log("no image found");
            setImage(null);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return (
    <>
      <View style={styles.container} lightColor={Colors.light.accentBackground} darkColor={Colors.dark.accentBackground}>
        <View style={styles.titleBar}>
          <Title style={{ fontSize: 26 }} lightColor="#000" darkColor="#FFF">
            {title}
          </Title>
          <Text style={[styles.monthTitle]}>{formatDateWithSuffix(currentMonth)}</Text>
        </View>

        <View style={styles.dateCardContainer}>
          {dates.map((date, i) => (
            <DateCard key={i} date={date} setImage={fetchImage} />
          ))}
        </View>
        <View style={styles.navigation}>
          <Pressable onPressIn={handlePrevMonth}>
            <Icon iconName="back-arrow" color="#4378ff" />
          </Pressable>
          <Pressable onPressIn={handleNextMonth}>
            <View>
              <Icon style={{ transform: [{ rotateZ: "180deg" }] }} iconName="back-arrow" color="#4378ff" />
            </View>
          </Pressable>
        </View>
        {image && <Image key={image.id} source={image.uri} style={{ width: "100%", aspectRatio: 1, borderRadius: 20, marginTop: 27 }} />}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 25,
    elevation: 2,
    width: "100%",
    borderRadius: 10,
    paddingVertical: 24,
    paddingHorizontal: 15,
    textAlign: "center",
    alignSelf: "center",
    minWidth: 0,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    alignSelf: "flex-end",
  },
  navButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  dateCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 7,
    marginTop: 17,
  },
  dateCard: {
    aspectRatio: 1,
    borderRadius: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    alignSelf: "flex-end",
  },
  dateText: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
});

export default Calendar;
