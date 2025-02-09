#!/bin/bash

if [[ "$DARKMODE" == "1" ]]; then
    # Dark Mode actions
    brew services reload sketchybar
    osascript -e 'display notification "Switched to Dark Mode. SketchyBar reloaded!" with title "Mode Changed"'
else
    # Light Mode actions
    brew services reload sketchybar
    osascript -e 'display notification "Switched to Light Mode. SketchyBar reloaded!" with title "Mode Changed"'
fi