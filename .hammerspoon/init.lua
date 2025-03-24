local WM = require("wm.manager")

-- 🔀 Swap windows
hs.hotkey.bind({ "alt", "shift" }, "N", function() WM.swapWindows(-1) end)
hs.hotkey.bind({ "alt", "shift" }, "M", function() WM.swapWindows(1) end)

-- ⬅➡ Move focus
hs.hotkey.bind({ "alt", "shift" }, "J", function() WM.moveFocus("left") end)
hs.hotkey.bind({ "alt", "shift" }, "L", function() WM.moveFocus("right") end)

-- 🔄 Cycle Layouts
hs.hotkey.bind({ "alt", "shift" }, ",", function() WM.cycleLayout(-1) end)
hs.hotkey.bind({ "alt", "shift" }, ".", function() WM.cycleLayout(1) end)

-- 🔧 Resize Windows
hs.hotkey.bind({ "alt", "shift" }, "-", function() WM.resizeFocusedWindow(-20) end)
hs.hotkey.bind({ "alt", "shift" }, "+", function() WM.resizeFocusedWindow(20) end)

-- 📺 Move to Screen
hs.hotkey.bind({ "alt", "shift" }, "H", function() WM.moveToScreen("left") end)
hs.hotkey.bind({ "alt", "shift" }, "J", function() WM.moveToScreen("right") end)

-- 🚀 Start
WM.start()
