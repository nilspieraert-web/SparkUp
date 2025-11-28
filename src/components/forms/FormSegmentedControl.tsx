import { useField } from 'formik';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../../contexts/ThemeContext';

interface Option<T extends string> {
  label: string;
  value: T;
}

interface FormSegmentedControlProps<T extends string> {
  name: string;
  label: string;
  options: Option<T>[];
}

export const FormSegmentedControl = <T extends string>({ name, label, options }: FormSegmentedControlProps<T>) => {
  const [field, , helpers] = useField<T>(name);
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText variant="subheading" style={styles.label}>
        {label}
      </ThemedText>
      <View style={[styles.segmentContainer, { borderColor: theme.colors.border }]}>
        {options.map((option) => {
          const isSelected = field.value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => helpers.setValue(option.value)}
              style={[
                styles.segment,
                {
                  backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <ThemedText style={{ color: isSelected ? '#FFFFFF' : theme.colors.muted }}>{option.label}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
});
