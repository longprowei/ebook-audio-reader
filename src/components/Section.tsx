import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function Section({ title, description, children }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingVertical: 8
  },
  heading: {
    gap: 3
  },
  title: {
    color: "#171512",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0
  },
  description: {
    color: "#665f55",
    fontSize: 14,
    lineHeight: 20
  }
});
