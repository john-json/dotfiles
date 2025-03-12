#!/bin/bash

CONFIG_DIR="$HOME/.config/sketchybar"
ITEMS_DIR="$CONFIG_DIR/items"
OPTIONS_DIR="$CONFIG_DIR/options"

# Check which mode to use
if [[ "$1" == "--full" ]]; then
    MODE="full_bar"
elif [[ "$1" == "--tiled" ]]; then
    MODE="tiled_bar"
else
    echo "Usage: sketchybar --full OR sketchybar --tiled"
    exit 1
fi

# Set the active mode
echo "$MODE" >"$CONFIG_DIR/current_mode"

# Copy the correct bar configuration
cp "$OPTIONS_DIR/$MODE/bar.lua" "$CONFIG_DIR/bar.lua"
cp "$OPTIONS_DIR/$MODE/left_bar.lua" "$ITEMS_DIR/left_bar.lua"
cp "$OPTIONS_DIR/$MODE/right_bar.lua" "$ITEMS_DIR/right_bar.lua"
cp "$OPTIONS_DIR/$MODE/center_bar.lua" "$ITEMS_DIR/center_bar.lua"

# Restart SketchyBar
brew services restart sketchybar

echo "Switched to $MODE mode and restarted SketchyBar."
