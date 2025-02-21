local Animations = {}

-- Smoothly animate window movement or resizing
function Animations.smoothTransition(win, targetFrame, duration, steps)
    if not win then return end
    local frame = win:frame()
    local stepCount = steps or 10
    local stepTime = duration or 0.02

    local deltaX = (targetFrame.x - frame.x) / stepCount
    local deltaY = (targetFrame.y - frame.y) / stepCount
    local deltaW = (targetFrame.w - frame.w) / stepCount
    local deltaH = (targetFrame.h - frame.h) / stepCount

    local step = 0
    hs.timer.doWhile(
        function() return step < stepCount end,
        function()
            step = step + 1
            frame.x = frame.x + deltaX
            frame.y = frame.y + deltaY
            frame.w = frame.w + deltaW
            frame.h = frame.h + deltaH
            win:setFrame(frame)
        end,
        stepTime
    )
end

return Animations