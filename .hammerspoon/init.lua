local hhtwm = require("hhtwm")

if not hhtwm then
    hs.alert.show("Error: hhtwm module failed to load!")
    return
end

-- Keybindings for moving and swapping focus
hs.hotkey.bind({ "alt", "ctrl" }, "i", function() hhtwm.moveFocus("up") end)
hs.hotkey.bind({ "alt", "ctrl" }, "k", function() hhtwm.moveFocus("down") end)
hs.hotkey.bind({ "alt", "ctrl" }, "j", function() hhtwm.moveFocus("left") end)
hs.hotkey.bind({ "alt", "ctrl" }, "l", function() hhtwm.moveFocus("right") end)

hs.hotkey.bind({ "alt", "ctrl" }, "n", function() hhtwm.swapFocus("up") end)
hs.hotkey.bind({ "alt", "ctrl" }, "m", function() hhtwm.swapFocus("down") end)

hs.hotkey.bind({ "alt", "ctrl" }, "-", function() hhtwm.resizeFocusedWindow(-0.1) end)
hs.hotkey.bind({ "alt", "ctrl" }, "+", function() hhtwm.resizeFocusedWindow(0.1) end)

hs.hotkey.bind({ "alt", "ctrl" }, ",", function() hhtwm.arrange() end)

-- Start tiling
hhtwm.start()
