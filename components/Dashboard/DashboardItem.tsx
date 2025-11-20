import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DashboardItemProps {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  title?: string;
  value: string;
  subtitle?: string;
  fineDust?: string;
  discomfortIndex?: string;

  backgroundColor: string;
}

const DashboardItem: React.FC<DashboardItemProps> = ({
  iconName,
  title,
  value,
  subtitle,
  fineDust,
  discomfortIndex,
  backgroundColor,
}) => {
  const hasExtraInfo = fineDust || discomfortIndex;

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name={iconName}
          size={30}
          color="#fff"
          style={styles.icon}
        />
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <Text style={styles.value}>{value}</Text>

      {hasExtraInfo ? (
        <View style={styles.multiLineInfo}>
          {fineDust && (
            <Text style={styles.multiLineText}>{`미세먼지: ${fineDust}`}</Text>
          )}
          {discomfortIndex && (
            <Text
              style={styles.multiLineText}
            >{`불쾌지수: ${discomfortIndex}`}</Text>
          )}
        </View>
      ) : (
        subtitle && <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    marginRight: 8,
  },

  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },

  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },

  multiLineInfo: {
    marginTop: 4,
  },

  multiLineText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
  },
});

export default DashboardItem;
