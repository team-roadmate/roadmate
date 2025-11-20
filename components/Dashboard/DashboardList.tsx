import DashboardItem from "@/components/Dashboard/DashboardItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface DashboardItemData {
  id: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  title?: string;
  value: string;
  subtitle?: string;
  fineDust?: string;
  discomfortIndex?: string;
  backgroundColor: string;
}

const DUMMY_DATA: DashboardItemData[] = [
  {
    id: "steps",
    value: "7,890 보",
    iconName: "walk",
    backgroundColor: "#4254C6",
  },
  {
    id: "weather",
    title: "구로구",
    value: "18°C 맑음",
    fineDust: "보통",
    discomfortIndex: "높음",
    iconName: "weather-sunny",
    backgroundColor: "#AEEA00",
  },
];

const DashboardList: React.FC = () => {
  return (
    <View style={styles.container}>
      {DUMMY_DATA.map((item) => (
        <DashboardItem
          key={item.id}
          iconName={item.iconName}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          fineDust={item.fineDust}
          discomfortIndex={item.discomfortIndex}
          backgroundColor={item.backgroundColor}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    rowGap: 10,
  },
});

export default DashboardList;
