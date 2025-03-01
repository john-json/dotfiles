local Layout = require("plugins.layout")
local Floating = require("plugins.floating")
local Utils = require("plugins.utils")
local hhtwm = require("hhtwm")


-- Set margins to keep SketchyBar visible
hhtwm.margin = { top = 40, bottom = 10, left = 10, right = 10 }

-- Default to main-center when a window opens on an empty desktop
hs.window.filter.default:subscribe(hs.window.filter.windowCreated, function(win)
    if #hs.window.allWindows() == 1 then
        hhtwm.setLayout("main-center")
    end
end)

-- Enable multi-monitor awareness
hhtwm.screenMargin = 10

-- Keybindings
hs.hotkey.bind({ "alt", "ctrl" }, "I", hhtwm.moveFocusUp)
hs.hotkey.bind({ "alt", "ctrl" }, "K", hhtwm.moveFocusDown)
hs.hotkey.bind({ "alt", "ctrl" }, "J", hhtwm.moveFocusLeft)
hs.hotkey.bind({ "alt", "ctrl" }, "L", hhtwm.moveFocusRight)

hs.hotkey.bind({ "alt", "ctrl" }, "N", hhtwm.swapFocusPrev)
hs.hotkey.bind({ "alt", "ctrl" }, "M", hhtwm.swapFocusNext)

hs.hotkey.bind({ "alt", "ctrl" }, "-", function() hhtwm.resizeFocusedWindow(-0.1) end)
hs.hotkey.bind({ "alt", "ctrl" }, "=", function() hhtwm.resizeFocusedWindow(0.1) end)

hs.hotkey.bind({ "alt", "ctrl" }, "F", function()
    local win = hs.window.focusedWindow()
    if win then win:maximize() end
end)

-- Start tiling
hhtwm.start()
