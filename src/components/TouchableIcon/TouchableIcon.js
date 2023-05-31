import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks';

const TouchableIcon = ({
  IconFamily,
  iconName,
  disabled,
  onPress,
  containerStyle,
}) => {
  const { fontSize } = useTheme();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={containerStyle}
      onPress={onPress}
    >
      <IconFamily
        name={iconName}
        size={fontSize || 14}
        color={disabled ? 'grey' : '#1f140e'}
      />
    </TouchableOpacity>
  );
};

export default TouchableIcon;
