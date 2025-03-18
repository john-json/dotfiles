local Layouts = {}

-- Store the available layouts
Layouts.availableLayouts = {
    "monocle",   -- Single maximized window
    "vertical",  -- Split windows vertically
    "horizontal" -- Split windows horizontally
}

-- Default to the first layout
Layouts.currentIndex = 1

function Layouts.current()
    local layoutName = Layouts.availableLayouts[Layouts.currentIndex]

    if layoutName == "monocle" then
        return function(windows, margin)
            if #windows == 0 then return end
            local screenFrame = windows[1]:screen():frame()

            for _, win in ipairs(windows) do
                win:setFrame({
                    x = screenFrame.x + margin.left,
                    y = screenFrame.y + margin.top,
                    w = screenFrame.w - (margin.left + margin.right),
                    h = screenFrame.h - (margin.top + margin.bottom),
                })
            end
        end
    elseif layoutName == "vertical" then
        return function(windows, margin)
            local screenFrame = windows[1]:screen():frame()
            local winCount = #windows
            local winHeight = screenFrame.h / winCount

            for i, win in ipairs(windows) do
                win:setFrame({
                    x = screenFrame.x + margin.left,
                    y = screenFrame.y + (winHeight * (i - 1)) + margin.top,
                    w = screenFrame.w - (margin.left + margin.right),
                    h = winHeight - (margin.top + margin.bottom),
                })
            end
        end
    elseif layoutName == "horizontal" then
        return function(windows, margin)
            local screenFrame = windows[1]:screen():frame()
            local winCount = #windows
            local winWidth = screenFrame.w / winCount

            for i, win in ipairs(windows) do
                win:setFrame({
                    x = screenFrame.x + (winWidth * (i - 1)) + margin.left,
                    y = screenFrame.y + margin.top,
                    w = winWidth - (margin.left + margin.right),
                    h = screenFrame.h - (margin.top + margin.bottom),
                })
            end
        end
    end

    return nil
end

function Layouts.next()
    Layouts.currentIndex = (Layouts.currentIndex % #Layouts.availableLayouts) + 1
    return Layouts.current()
end

return Layouts
