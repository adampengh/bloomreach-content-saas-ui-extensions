import { BloomreachTheme } from './schemes/BloomreachTheme';

const themeMap = {
  BloomreachTheme
};

export function themeCreator(theme) {
  return themeMap[theme];
}
