import React, { useState, useEffect } from "react";
import { StyleSheet, LayoutChangeEvent, Pressable } from "react-native";
import { Link } from "expo-router";
import { Text, View, Button, useThemeColor } from "./Themed";
import Colors from "@/constants/Colors";
import { universalStyles } from "@/constants/Styles";

const layoutConstants = {
  cardMinWidth: 57,
  cardMinHeight: 86,
  minCardGap: 10,
  container_padding: 30, // Sum of horizontal padding values
};

interface CalendarProps {
  title: string;
}

interface DateCardProps {
  date: Date;
}

interface DateCardRowProps {
  rowNumber: number;
  cardNumber: number;
  dates: Date[];
}

const getDate = (date: Date) => {
  const formattedDate = `${date.getDate()}`;
  return formattedDate.toString().padStart(2, "0");
};

const getDayOfWeek = (date: Date) => {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return daysOfWeek[date.getDay()];
};

const DateCard: React.FC<DateCardProps> = ({ date }) => {
  const [parentWidth, setParentWidth] = useState<number>(0);

  const handleCardLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setParentWidth(width);
  };

  const currentDate = new Date();
  const isCurrentDate = date.toDateString() === currentDate.toDateString();

  const backgroundColor = useThemeColor({}, isCurrentDate ? "tint" : "background");
  const textColor = isCurrentDate ? "#fff" : "#4378ff";

  return (
    <Link href={`/view-picture?date=${date.toISOString().split("T")[0]}`} asChild>
      <Pressable lightColor={Colors.light.tint} darkColor={Colors.dark.tint}>
        <View style={styles.dateCard} lightColor={backgroundColor} darkColor={backgroundColor} onLayout={handleCardLayout}>
          <Text style={styles.dayOfWeek} lightColor={textColor} darkColor="#fff" fontWeight="500">
            {getDayOfWeek(date)}
          </Text>
          <Text style={styles.dateText} lightColor={textColor} darkColor="#fff" fontWeight="700">
            {getDate(date)}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

const DateCardRow: React.FC<DateCardRowProps> = ({ rowNumber, cardNumber, dates }) => {
  const startingValue = rowNumber * cardNumber;
  const rowDates = dates.slice(startingValue, startingValue + cardNumber);

  return (
    <View style={styles.dateCardRow}>
      {rowDates.map((date, i) => (
        <DateCard key={i} date={date} />
      ))}
    </View>
  );
};

const Calendar: React.FC<CalendarProps> = ({ title }) => {
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setParentWidth(width);
  };

  const availableParentWidth = parentWidth - layoutConstants.container_padding; //exclude the padding

  // Calculate maximum number of cards that can fit on one line;
  const maxCards = Math.floor((availableParentWidth + layoutConstants.minCardGap) / (layoutConstants.cardMinWidth + layoutConstants.minCardGap));

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
  const rows = Math.ceil(dates.length / maxCards);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <View style={styles.container} lightColor={Colors.light.accentBackground} darkColor={Colors.dark.accentBackground} onLayout={handleLayout}>
      <Text style={[styles.title]} lightColor="#000" darkColor="#FFF" fontWeight="700">
        {title}
      </Text>
      <View style={styles.navigation}>
        <Button style={{ height: "fit", flex: 1 }} onPress={handlePrevMonth}>
          <Text style={styles.navButton}>{"<"}</Text>
        </Button>
        <Text style={[styles.monthTitle, { flexGrow: 1, textAlign: "center" }]}>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</Text>
        <Button style={{ height: "fit", flex: 1 }} onPress={handleNextMonth}>
          <Text style={styles.navButton}>{">"}</Text>
        </Button>
      </View>
      {Array.from({ length: rows }).map((_, i) => (
        <DateCardRow rowNumber={i} cardNumber={maxCards} dates={dates} key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 25,
    elevation: 2,
    width: "100%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: layoutConstants.container_padding / 2,
    textAlign: "center",
    alignSelf: "center",
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  navButton: {
    fontSize: 18,
    fontWeight: "bold",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateCardRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
  },
  dateCard: {
    width: layoutConstants.cardMinWidth,
    minHeight: layoutConstants.cardMinHeight,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 15,
    marginVertical: 10,
    elevation: 2,
    alignSelf: "flex-end",
    marginHorizontal: 0,
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
  },
  dateText: {
    fontSize: 26,
    fontWeight: 700,
    textAlign: "center",
  },
});

export default Calendar;
