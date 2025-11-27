import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type Variant = 'body' | 'heading' | 'subheading' | 'caption';

interface VariantStyle {
  fontSize: number;
  fontFamily: string;
}

interface ThemedTextProps extends TextProps {
  variant?: Variant;
}

const variantStyles: Record<Variant, VariantStyle> = {
  body: { fontSize: 16, fontFamily: 'Urbanist_400Regular' },
  heading: { fontSize: 24, fontFamily: 'Urbanist_700Bold' },
  subheading: { fontSize: 18, fontFamily: 'Urbanist_600SemiBold' },
  caption: { fontSize: 13, fontFamily: 'Urbanist_400Regular' },
};

export const ThemedText: React.FC<ThemedTextProps> = ({ style, variant = 'body', children, ...rest }) => {
  const { theme } = useTheme();
  const variantStyle = variantStyles[variant];

  return (
    <Text
      {...rest}
      style={[
        { color: theme.colors.text },
        variantStyle,
        style,
      ]}
    >
      {children}
    </Text>
  );
};
