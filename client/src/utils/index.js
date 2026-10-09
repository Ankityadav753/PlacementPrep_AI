export * from './constants.js';

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
