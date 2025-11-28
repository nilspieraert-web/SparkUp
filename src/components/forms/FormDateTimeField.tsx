import React, { useCallback, useState } from 'react';
import { useField } from 'formik';
import DateTimePicker, { DateTimePickerAndroid, AndroidNativeProps, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { useTheme } from '../../contexts/ThemeContext';

interface FormDateTimeFieldProps {
  name: string;
  label: string;
  mode: AndroidNativeProps['mode'];
}

export const FormDateTimeField: React.FC<FormDateTimeFieldProps> = ({ name, label, mode }) => {
  const [field, , helpers] = useField<number>(name);
  const { theme } = useTheme();
  const [iosVisible, setIosVisible] = useState<boolean>(false);

  const handleChange = useCallback(
    (_event: DateTimePickerEvent, date?: Date) => {
      if (date) {
        helpers.setValue(date.getTime());
      }
      if (Platform.OS === 'ios') {
        setIosVisible(false);
      }
    },
    [helpers],
  );

  const openPicker = useCallback(() => {
    const currentDate = new Date(field.value);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: currentDate,
        mode,
        onChange: handleChange,
      });
    } else {
      setIosVisible(true);
    }
  }, [field.value, handleChange, mode]);

  const formattedValue = new Date(field.value).toLocaleString();

  return (
    <View style={styles.container}>
      <ThemedText variant="subheading" style={styles.label}>
        {label}
      </ThemedText>
      <Pressable
        onPress={openPicker}
        style={[styles.field, { borderColor: theme.colors.border }]}
        accessibilityRole="button"
      >
        <ThemedText>{formattedValue}</ThemedText>
      </Pressable>
      {Platform.OS === 'ios' ? (
        <Modal transparent visible={iosVisible} animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <DateTimePicker
                value={new Date(field.value)}
                mode={mode}
                onChange={handleChange}
              />
              <Pressable onPress={() => setIosVisible(false)} style={styles.closeButton} accessibilityRole="button">
                <ThemedText>Done</ThemedText>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  field: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
});
