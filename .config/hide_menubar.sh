#!/bin/bash

# Kill and restart SystemUIServer to reset menu bar
killall SystemUIServer

# Ensure yabai is running (used to block macOS menu interactions)
if ! command -v yabai &> /dev/null; then
    echo "Yabai is not installed. Please install it first: https://github.com/koekeishiya/yabai"
    exit 1
fi

# Use yabai to block interactions with the menu bar
yabai -m rule --add app="SystemUIServer" manage=off

# Create a transparent overlay at the top of the screen to block the menu bar from showing
osascript -l JavaScript <<EOF
ObjC.import('Cocoa');

var window = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
    $.NSMakeRect(0, $.NSScreen.mainScreen.frame.size.height - 22, $.NSScreen.mainScreen.frame.size.width, 22),
    $.NSWindowStyleMaskBorderless,
    $.NSBackingStoreBuffered,
    false
);

window.setLevel($.NSMainMenuWindowLevel + 1);
window.setIgnoresMouseEvents(true);
window.setBackgroundColor($.NSColor.clearColor);
window.makeKeyAndOrderFront(nil);
$.NSApplication.sharedApplication.run();
EOF
