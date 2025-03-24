local Animations = {}

function Animations.smoothMove(win, newFrame)
    local startFrame = win:frame()
    local step = 0

    hs.timer.doWhile(
        function() return step <= 1 end,
        function()
            local progress = step
            local interpolatedFrame = {
                x = startFrame.x + (newFrame.x - startFrame.x) * progress,
                y = startFrame.y + (newFrame.y - startFrame.y) * progress,
                w = startFrame.w + (newFrame.w - startFrame.w) * progress,
                h = startFrame.h + (newFrame.h - startFrame.h) * progress,
            }
            win:setFrame(interpolatedFrame)
            step = step + 0.1
        end,
        0.02
    )
end

return Animations
