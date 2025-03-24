local WM = {}
local Layouts = require("wm.layouts")
local Animations = require("wm.animations")

WM.margin = { top = 40, bottom = 10, left = 20, right = 20 } -- Padding
WM.screenLayouts = {}                                        -- Store layouts per screen

WM.layouts = {
    "floating",
    "dynamic",
    "tall"
}

-- ✅ Ensure valid screen
function WM.getValidScreen(screen)
    return screen and screen:frame() and screen or hs.screen.mainScreen()
end

-- ✅ Get all windows on a valid screen
function WM.getWindowsOnScreen(screen)
    local validScreen = WM.getValidScreen(screen)
    local wf = hs.window.filter.new():setScreens(validScreen:id())
    return wf:getWindows()
end

-- 🔄 Arrange windows based on layout
function WM.arrange()
    for _, screen in ipairs(hs.screen.allScreens()) do
        local windows = WM.getWindowsOnScreen(screen)
        if #windows > 0 then
            local layoutIndex = WM.screenLayouts[screen:id()] or 1
            local layout = Layouts[WM.layouts[layoutIndex]]
            if layout then
                layout(windows, screen, WM.margin)
            end
        end
    end
end

-- 🔄 Cycle layouts per screen
function WM.cycleLayout(direction)
    for _, screen in ipairs(hs.screen.allScreens()) do
        local layoutCount = #WM.layouts
        local currentLayout = WM.screenLayouts[screen:id()] or 1
        local newLayout = (currentLayout + direction - 1) % layoutCount + 1
        WM.screenLayouts[screen:id()] = newLayout
    end
    WM.arrange()
end

-- 🎯 Move focus between windows
function WM.moveFocus(direction)
    local focusedWindow = hs.window.focusedWindow()
    if focusedWindow then
        local screen = focusedWindow:screen()
        local windows = WM.getWindowsOnScreen(screen)

        local target
        if direction == "left" then
            target = focusedWindow:windowsToWest()
        elseif direction == "right" then
            target = focusedWindow:windowsToEast()
        elseif direction == "up" then
            target = focusedWindow:windowsToNorth()
        elseif direction == "down" then
            target = focusedWindow:windowsToSouth()
        end

        if target then target:focus() end
    end
end

-- 🔄 Swap windows (✅ FIXED: Convert `direction` to number)
function WM.swapWindows(direction)
    local focusedWindow = hs.window.focusedWindow()
    if not focusedWindow then return end

    local screen = focusedWindow:screen()
    local windows = WM.getWindowsOnScreen(screen)
    local index = hs.fnutils.indexOf(windows, focusedWindow)

    if index and windows[index + tonumber(direction)] then
        windows[index], windows[index + tonumber(direction)] = windows[index + tonumber(direction)], windows[index]
        WM.arrange()
    end
end

-- ✅ Resize focused window properly
function WM.resizeFocusedWindow(amount)
    local win = hs.window.focusedWindow()
    if not win then return end

    local frame = win:frame()
    frame.w = frame.w + amount
    win:setFrame(frame)
end

-- ✅ Move focused window to another screen
function WM.moveToScreen(direction)
    local win = hs.window.focusedWindow()
    if not win then return end

    local screen = win:screen()
    local targetScreen = (direction == "left") and screen:previous() or screen:next()

    if targetScreen then
        win:moveToScreen(targetScreen)
        WM.arrange()
    end
end

-- 🎬 Start the window manager
function WM.start()
    hs.alert.show("Window Manager Active")
    WM.arrange()
end

return WM
