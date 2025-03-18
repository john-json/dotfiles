local WM = {}

local Layouts = require("wm.layouts")
local Animations = require("wm.animations") or {}
local Window = hs.window

WM.margin = { top = 40, bottom = 10, left = 10, right = 10 }
WM.isFloating = false

function WM.getWindowsOnScreen()
    local win = Window.focusedWindow()
    if not win then return {} end

    local screen = win:screen()
    if not screen then return {} end

    return hs.window.filter.new():setCurrentSpace(true):setScreens({ screen:id() }):getWindows() or {}
end

function WM.arrange()
    local windows = WM.getWindowsOnScreen()
    if #windows == 0 then return end

    local layout = Layouts.current()
    if layout then
        layout(windows, WM.margin)
    end
end

function WM.start()
    hs.alert.show("Tiling Started!")
    WM.arrange()
end

return WM
