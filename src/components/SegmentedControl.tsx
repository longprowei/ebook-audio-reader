import { Pressable, StyleSheet, Text, View } from "react-native";

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange
}: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, isActive && styles.activeOption]}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e8e1d4",
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    padding: 5
  },
  option: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 8
  },
  activeOption: {
    backgroundColor: "#ffffff"
  },
  label: {
    color: "#665f55",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0
  },
  activeLabel: {
    color: "#171512"
  }
});
