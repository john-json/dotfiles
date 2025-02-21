local Utils = {}
local Animations = require("plugins.animations")

function Utils.getWindowsByScreen()
    local screens = hs.screen.allScreens()
    local screenWindows = {}

    for _, screen in ipairs(screens) do
        screenWindows[screen:id()] = {}
    end

    for _, win in ipairs(hs.window.allWindows()) do
        local screen = win:screen()
        if screen then
            table.insert(screenWindows[screen:id()], win)
        end
    end

    return screenWindows
end

-- Smoothly move window in a direction
function Utils.moveWindow(direction)
    local win = hs.window.focusedWindow()
    if not win then return end

    local frame = win:frame()
    local step = 40 -- Move distance in pixels

    if direction == "up" then frame.y = frame.y - step end
    if direction == "down" then frame.y = frame.y + step end
    if direction == "left" then frame.x = frame.x - step end
    if direction == "right" then frame.x = frame.x + step end

    Animations.smoothTransition(win, frame, 0.1, 10)
end

-- Smoothly resize window
function Utils.resizeWindow(factor)
    local win = hs.window.focusedWindow()
    if not win then return end

    local frame = win:frame()
    local screenFrame = win:screen():frame()

    frame.w = math.min(screenFrame.w, frame.w * factor)
    frame.h = math.min(screenFrame.h, frame.h * factor)

    Animations.smoothTransition(win, frame, 0.1, 10)
end

function Utils.cycleFocus(step)
    local windows = hs.window.orderedWindows()
    local focused = hs.window.focusedWindow()
    if not focused then return end

    for i, win in ipairs(windows) do
        if win == focused then
            local nextIndex = ((i + step - 1) % #windows) + 1
            windows[nextIndex]:focus()
            return
        end
    end
end

function Utils.maximizeCenteredWindow()
    local windows = hs.window.allWindows()
    if #windows == 1 then
        windows[1]:maximize()
    else
        hs.alert.show("Not a single window")
    end
end

return Utils
