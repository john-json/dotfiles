#!/bin/bash

# File to store previous mode state
STATE_FILE="$HOME/.config/sketchybar/items/scripts/dark-mode-state"

# Get the current macOS appearance mode (returns "Dark" or empty)
APPEARANCE=$(defaults read -g AppleInterfaceStyle 2>/dev/null)

# If empty, set to "Light"
if [[ -z "$APPEARANCE" ]]; then
    APPEARANCE="Light"
fi

# Read the last known state from the file
if [[ -f "$STATE_FILE" ]]; then
    LAST_MODE=$(cat "$STATE_FILE")
else
    LAST_MODE="Unknown"
fi

# If the mode changed, trigger actions
if [[ "$APPEARANCE" != "$LAST_MODE" ]]; then
    echo "$APPEARANCE" > "$STATE_FILE"

    # Reload SketchyBar
    brew services reload sketchybar

    # Send macOS notification
    osascript -e "display notification \"Switched to $APPEARANCE Mode. SketchyBar reloaded!\" with title \"Mode Changed\""
fi