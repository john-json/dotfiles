local Animations = {}

-- **Smooth Animation (Faster & Smoother)**
function Animations.smoothTransition(win, targetFrame, duration, steps)
    if not win or not targetFrame then return end

    local startFrame = win:frame()
    local stepDuration = duration / steps

    for step = 1, steps do
        hs.timer.doAfter(step * stepDuration, function()
            if win then
                local newFrame = {
                    x = startFrame.x + ((targetFrame.x - startFrame.x) * step / steps),
                    y = startFrame.y + ((targetFrame.y - startFrame.y) * step / steps),
                    w = startFrame.w + ((targetFrame.w - startFrame.w) * step / steps),
                    h = startFrame.h + ((targetFrame.h - startFrame.h) * step / steps)
                }
                win:setFrame(newFrame)
            end
        end)
    end
end

return Animations
