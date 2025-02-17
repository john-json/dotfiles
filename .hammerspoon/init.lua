function easeOutQuad(t, b, c, d)
    t = t / d
    return -c * t * (t - 2) + b
end

function moveWindowSmooth(direction)
    local win = hs.window.focusedWindow()
    if not win then return end

    local duration = 0.3  -- Total animation time
    local steps = 30  -- More steps for smoother motion
    local stepTime = duration / steps

    local frame = win:frame()
    local startX, startY = frame.x, frame.y
    local targetX, targetY = startX, startY

    if direction == "left" then targetX = frame.x - 200 end
    if direction == "right" then targetX = frame.x + 200 end
    if direction == "up" then targetY = frame.y - 200 end
    if direction == "down" then targetY = frame.y + 200 end

    local step = 0
    hs.timer.doWhile(
        function() return step <= steps end,
        function()
            local newX = easeOutQuad(step, startX, targetX - startX, steps)
            local newY = easeOutQuad(step, startY, targetY - startY, steps)
            frame.x = newX
            frame.y = newY
            win:setFrame(frame)
            step = step + 1
        end,
        stepTime
    )
end

-- Bind movement to hotkeys
hs.hotkey.bind({"cmd", "alt", "ctrl"}, "j", function() moveWindowSmooth("left") end)
hs.hotkey.bind({"cmd", "alt", "ctrl"}, "l", function() moveWindowSmooth("right") end)
hs.hotkey.bind({"cmd", "alt", "ctrl"}, "i", function() moveWindowSmooth("up") end)
hs.hotkey.bind({"cmd", "alt", "ctrl"}, "k", function() moveWindowSmooth("down") end)

hs.alert.show("Window Manager Active")

-- Center new windows automatically
function centerWindow(win)
    if not win then return end
    local screenFrame = win:screen():frame()
    local winFrame = win:frame()

    winFrame.x = screenFrame.x + (screenFrame.w - winFrame.w) / 2
    winFrame.y = screenFrame.y + (screenFrame.h - winFrame.h) / 2
    win:setFrame(winFrame)
end

-- Detect new windows
hs.window.filter.default:subscribe(hs.window.filter.windowCreated, function(win)
    local windows = hs.window.allWindows()
    if #windows == 1 then
        centerWindow(win)
    end
end)

function arrangeWindows()
    local windows = hs.window.allWindows()
    local screen = hs.screen.primaryScreen()
    local screenFrame = screen:frame()

    if #windows == 1 then
        -- Single window centered
        centerWindow(windows[1])

    elseif #windows == 2 then
        -- Two windows, 50/50 split
        local win1 = windows[1]
        local win2 = windows[2]

        local halfScreen = screenFrame.w / 2
        win1:setFrame({x = screenFrame.x, y = screenFrame.y, w = halfScreen, h = screenFrame.h})
        win2:setFrame({x = screenFrame.x + halfScreen, y = screenFrame.y, w = halfScreen, h = screenFrame.h})

    elseif #windows == 3 then
        -- Three windows: left half, right top/bottom split
        local win1 = windows[1]
        local win2 = windows[2]
        local win3 = windows[3]

        local halfScreen = screenFrame.w / 2
        local quarterScreen = screenFrame.h / 2

        win1:setFrame({x = screenFrame.x, y = screenFrame.y, w = halfScreen, h = screenFrame.h})
        win2:setFrame({x = screenFrame.x + halfScreen, y = screenFrame.y, w = halfScreen, h = quarterScreen})
        win3:setFrame({x = screenFrame.x + halfScreen, y = screenFrame.y + quarterScreen, w = halfScreen, h = quarterScreen})

    else
        -- More than 3 windows, fallback: grid layout
        local columns = 2
        local rows = math.ceil(#windows / columns)
        local winWidth = screenFrame.w / columns
        local winHeight = screenFrame.h / rows

        for i, win in ipairs(windows) do
            local col = (i - 1) % columns
            local row = math.floor((i - 1) / columns)
            win:setFrame({
                x = screenFrame.x + col * winWidth,
                y = screenFrame.y + row * winHeight,
                w = winWidth,
                h = winHeight
            })
        end
    end
end

-- Auto-rearrange when a new window is created
hs.window.filter.default:subscribe(hs.window.filter.windowCreated, function()
    hs.timer.doAfter(0.1, arrangeWindows)
end)