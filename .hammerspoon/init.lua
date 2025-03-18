local WM = require("wm.manager")
local Spaces = require("wm.spaces")

-- Keybindings for window movement
hs.hotkey.bind({ "shift", "ctrl" }, "i", function() WM.moveFocus("up") end)
hs.hotkey.bind({ "shift", "ctrl" }, "k", function() WM.moveFocus("down") end)
hs.hotkey.bind({ "shift", "ctrl" }, "j", function() WM.moveFocus("left") end)
hs.hotkey.bind({ "shift", "ctrl" }, "l", function() WM.moveFocus("right") end)

-- Swap windows
hs.hotkey.bind({ "shift", "ctrl" }, "n", function() WM.swapWindows("up") end)
hs.hotkey.bind({ "shift", "ctrl" }, "m", function() WM.swapWindows("down") end)

-- Resize window
hs.hotkey.bind({ "shift", "ctrl" }, "-", function() WM.resizeFocusedWindow(-0.1) end)
hs.hotkey.bind({ "shift", "ctrl" }, "+", function() WM.resizeFocusedWindow(0.1) end)

-- Maximize window
hs.hotkey.bind({ "shift", "ctrl" }, "f", function() WM.maximize() end)

-- Reapply layout
hs.hotkey.bind({ "shift", "ctrl" }, ",", function() WM.arrange() end)
-- Move window between macOS Spaces
hs.hotkey.bind({ "shift", "ctrl" }, "p", function() Spaces.moveWindowToSpace("left") end)
hs.hotkey.bind({ "shift", "ctrl" }, "o", function() Spaces.moveWindowToSpace("right") end)

-- Start the window manager
WM.start()
