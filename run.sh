#!/bin/bash
# VoxBattle - Build & Run Script
# Usage: ./run.sh [build|start|restart]

PORT=8082
BUNDLE_ID="com.alperyardimci.VoxBattle"

kill_metro() {
  lsof -ti:$PORT 2>/dev/null | xargs kill -9 2>/dev/null
  sleep 1
}

start_metro() {
  echo "Starting Metro Bundler on port $PORT..."
  kill_metro
  npx expo start --port $PORT --dev-client &
  sleep 5
  echo "Metro running."
}

launch_app() {
  echo "Launching VoxBattle..."
  xcrun simctl terminate booted $BUNDLE_ID 2>/dev/null
  sleep 1
  xcrun simctl launch booted $BUNDLE_ID
  echo "App launched!"
}

case "${1:-start}" in
  build)
    echo "=== Full Build ==="
    kill_metro
    pkill -f xcodebuild 2>/dev/null
    rm -rf ios
    npx expo prebuild --platform ios
    npx expo run:ios --port $PORT
    ;;
  start)
    start_metro
    launch_app
    ;;
  restart)
    kill_metro
    start_metro
    launch_app
    ;;
  *)
    echo "Usage: ./run.sh [build|start|restart]"
    ;;
esac
