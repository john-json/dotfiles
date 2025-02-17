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

hs.alert.show("Smooth Window Movement Loaded!")