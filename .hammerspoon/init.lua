local Layout = require("plugins.layout")
local Floating = require("plugins.floating")
local Utils = require("plugins.utils")

-- Resize Window (Alt + Ctrl + +/-)
hs.hotkey.bind({"alt", "ctrl"}, "=", function() Utils.resizeWindow(1.1) end) -- Increase
hs.hotkey.bind({"alt", "ctrl"}, "-", function() Utils.resizeWindow(0.9) end) -- Decrease

-- Cycle Layouts (Alt + Ctrl + , / .)
hs.hotkey.bind({"alt", "ctrl"}, ",", function() Layout.cycleLayout(-1) end) -- Previous
hs.hotkey.bind({"alt", "ctrl"}, ".", function() Layout.cycleLayout(1) end)  -- Next

-- Move Focused Window (Alt + Ctrl + I/J/K/L)
hs.hotkey.bind({"alt", "ctrl"}, "i", function() Utils.moveWindow("up") end)
hs.hotkey.bind({"alt", "ctrl"}, "k", function() Utils.moveWindow("down") end)
hs.hotkey.bind({"alt", "ctrl"}, "j", function() Utils.moveWindow("left") end)
hs.hotkey.bind({"alt", "ctrl"}, "l", function() Utils.moveWindow("right") end)

-- Cycle Window Focus (Alt + Ctrl + N / M)
hs.hotkey.bind({"alt", "ctrl"}, "n", function() Utils.cycleFocus(-1) end) -- Backward
hs.hotkey.bind({"alt", "ctrl"}, "m", function() Utils.cycleFocus(1) end)  -- Forward

-- Maximize Centered Window (Alt + Ctrl + F)
hs.hotkey.bind({"alt", "ctrl"}, "f", function() Utils.maximizeCenteredWindow() end)

-- Auto-Arrange Windows on New Window Creation
hs.window.filter.default:subscribe(hs.window.filter.windowCreated, function()
    hs.timer.doAfter(0.1, Layout.arrangeWindows)
end)

-- Show Startup Message
hs.alert.show("Hammerspoon Window Manager Loaded!")