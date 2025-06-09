#!/usr/bin/env bash

# Get the ID of the newly created window
window_id="$YABAI_WINDOW_ID"

# Get the number of windows in the current space
window_count=$(yabai -m query --windows --space | jq 'length')

# If there's only one window in the space
if [ "$window_count" -eq 1 ]; then
    # Float the window
    yabai -m window "$window_id" --toggle float
    # Center the window using a grid layout
    yabai -m window "$window_id" --grid 4:4:1:1:2:2
fi
