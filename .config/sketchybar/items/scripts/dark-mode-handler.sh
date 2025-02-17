#!/bin/bash

if [[ "$APPEARANCE" == "Dark" ]];  then
    # Dark Mode actions
    brew services reload sketchybar
    osascript -e 'display notification "Switched to light Mode. SketchyBar reloaded!" with title "Mode Changed"'
else
    # Light Mode actions
    brew services reload sketchybar
    osascript -e 'display notification "Switched to dark Mode. SketchyBar reloaded!" with title "Mode Changed"'
fi