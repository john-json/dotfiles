#!/usr/bin/env zsh

APPEARANCE=$(defaults read -g AppleInterfaceStyle 2>/dev/null)

if [[ "$APPEARANCE" == "Dark" ]]; then
    # Dark Mode actions
    brew services reload sketchybar
    osascript -e 'display notification "Switched to Dark Mode. SketchyBar reloaded!" with title "Mode Changed"'
else
    # Light Mode actions
    brew services reload sketchybar
    osascript -e 'display notification "Switched to Light Mode. SketchyBar reloaded!" with title "Mode Changed"'
fi
