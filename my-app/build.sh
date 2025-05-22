#!/bin/bash

# build.sh - Clean rebuild script for React Native Expo projects
# Usage: bash build.sh [platform]
# where platform is optional and can be 'android', 'ios', or 'web'

# Set text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting complete clean rebuild process...${NC}"

# Step 1: Stop any running Metro processes
echo -e "${GREEN}Stopping any running Metro processes...${NC}"
pkill -f "react-native start" || true
pkill -f "expo start" || true

# Step 2: Clean npm cache
echo -e "${GREEN}Cleaning npm cache...${NC}"
npm cache clean --force

# Step 3: Remove node_modules and package lock files
echo -e "${GREEN}Removing node_modules and lock files...${NC}"
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Step 4: Clean Metro bundler cache
echo -e "${GREEN}Clearing Metro bundler cache...${NC}"
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# Step 5: Remove Expo cache
echo -e "${GREEN}Cleaning Expo cache...${NC}"
rm -rf .expo
rm -rf .expo-shared

# Step 6: Clean Android build if it exists
if [ -d "android" ]; then
  echo -e "${GREEN}Cleaning Android build files...${NC}"
  cd android
  ./gradlew clean || echo "Failed to clean Android build, directory may not be initialized yet."
  rm -rf .gradle
  rm -rf build/
  rm -rf app/build/
  cd ..
fi

# Step 7: Clean iOS build if it exists
if [ -d "ios" ]; then
  echo -e "${GREEN}Cleaning iOS build files...${NC}"
  cd ios
  rm -rf build/
  rm -rf Pods/
  rm -f Podfile.lock
  cd ..
fi

# Step 8: Clean watchman watches
echo -e "${GREEN}Resetting Watchman...${NC}"
watchman watch-del-all 2>/dev/null || echo "Watchman not installed or failed to reset watches."

# Step 9: Reinstall dependencies
echo -e "${GREEN}Reinstalling dependencies...${NC}"
npm install

# Step 10: Pod install for iOS if applicable
if [ -d "ios" ]; then
  echo -e "${GREEN}Installing iOS Pods...${NC}"
  cd ios
  pod install
  cd ..
fi

# Step 11: Run the project based on the specified platform
if [ -z "$1" ]; then
  echo -e "${YELLOW}Clean rebuild completed! Run your project manually.${NC}"
  echo "Command suggestions:"
  echo "  npm run android - For Android"
  echo "  npm run ios - For iOS"
  echo "  npm run web - For Web"
elif [ "$1" == "android" ]; then
  echo -e "${GREEN}Starting Android...${NC}"
  npm run android
elif [ "$1" == "ios" ]; then
  echo -e "${GREEN}Starting iOS...${NC}"
  npm run ios
elif [ "$1" == "web" ]; then
  echo -e "${GREEN}Starting Web...${NC}"
  npm run web
else
  echo -e "${YELLOW}Unknown platform: $1${NC}"
  echo "Valid platforms are: android, ios, web"
fi

echo -e "${YELLOW}Process completed!${NC}"