import React from 'react';
import { TextInput } from 'react-native';

const FKTextInput = ({ field: { name, value, onChange } }) => (
  <TextInput onChangeText={onChange(name)} value={value} />
);

export default FKTextInput;
