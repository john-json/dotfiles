local Animations = {}

local function easeOutExpo(t)
    return 1 - (2 ^ (-10 * t))
end

function Animations.smoothTransition(win, targetFrame, duration, steps)
    if not win then return end
    local frame = win:frame()
    local stepCount = steps or 8
    local stepTime = duration or 0.012 -- Faster transition

    local deltaX = targetFrame.x - frame.x
    local deltaY = targetFrame.y - frame.y
    local deltaW = targetFrame.w - frame.w
    local deltaH = targetFrame.h - frame.h

    local step = 0
    hs.timer.doWhile(
        function() return step < stepCount end,
        function()
            step = step + 1
            local progress = easeOutExpo(step / stepCount)

            frame.x = frame.x + deltaX * progress / stepCount
            frame.y = frame.y + deltaY * progress / stepCount
            frame.w = frame.w + deltaW * progress / stepCount
            frame.h = frame.h + deltaH * progress / stepCount

            win:setFrame(frame)
        end,
        stepTime
    )
end

function Animations.animateLayoutTransition(windows, targetFrames, duration, steps)
    for i, win in ipairs(windows) do
        local target = targetFrames[i]
        if target then
            Animations.smoothTransition(win, target, duration, steps)
        end
    end
end

return Animations
