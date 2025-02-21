local Utils = {}

-- Ensure SketchyBar is not covered
Utils.topPadding = 40
Utils.sidePadding = 10

function Utils.applyPadding(frame, screenFrame)
    return {
        x = frame.x + Utils.sidePadding,
        y = frame.y + Utils.topPadding,
        w = frame.w - 2 * Utils.sidePadding,
        h = frame.h - Utils.topPadding - Utils.sidePadding
    }
end

function Utils.getWindowsByScreen()
    local screenWindows = {}
    for _, screen in ipairs(hs.screen.allScreens()) do
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

function Utils.moveWindow(direction)
    local win = hs.window.focusedWindow()
    if not win then return end

    local frame = win:frame()
    local step = 40 -- Move step size in pixels

    if direction == "up" then frame.y = frame.y - step end
    if direction == "down" then frame.y = frame.y + step end
    if direction == "left" then frame.x = frame.x - step end
    if direction == "right" then frame.x = frame.x + step end

    win:setFrame(frame)
end

function Utils.resizeWindow(factor)
    local win = hs.window.focusedWindow()
    if not win then return end

    local frame = win:frame()
    local screenFrame = win:screen():frame()

    frame.w = math.min(screenFrame.w, frame.w * factor)
    frame.h = math.min(screenFrame.h, frame.h * factor)

    win:setFrame(frame)
end

return Utils
