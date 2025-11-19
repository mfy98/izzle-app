// This file runs BEFORE jest-expo setup
// Mock expo-modules-core before jest-expo tries to use it

jest.mock('expo-modules-core', () => {
  const actualModule = jest.requireActual('expo-modules-core');
  return {
    ...actualModule,
    requireNativeModule: jest.fn(),
    requireOptionalNativeModule: jest.fn(),
  };
}, { virtual: true });

// Mock expo-modules-core/build/Refs
jest.mock('expo-modules-core/build/Refs', () => ({
  requireNativeModule: jest.fn(),
  requireOptionalNativeModule: jest.fn(),
}), { virtual: true });

// Mock expo-modules-core/src/Refs
jest.mock('expo-modules-core/src/Refs', () => ({
  requireNativeModule: jest.fn(),
  requireOptionalNativeModule: jest.fn(),
}), { virtual: true });

