local Layouts = {}

function Layouts.get(index)
    if index == 1 then
        return function(windows, screen, margin)
            -- Floating Mode: Do nothing
        end
    elseif index == 2 then
        return function(windows, screen, margin)
            -- Dynamic Layout
            local screenFrame = screen:frame()
            local leftWin = windows[1]
            local rightWins = { table.unpack(windows, 2) }

            leftWin:setFrame({
                x = screenFrame.x + margin.left,
                y = screenFrame.y + margin.top,
                w = (screenFrame.w * 0.5) - margin.right,
                h = screenFrame.h - (margin.top + margin.bottom),
            })

            local yOffset = margin.top
            local heightPerWin = (screenFrame.h - margin.top - margin.bottom) / #rightWins

            for _, win in ipairs(rightWins) do
                win:setFrame({
                    x = screenFrame.x + (screenFrame.w * 0.5) + margin.left,
                    y = screenFrame.y + yOffset,
                    w = (screenFrame.w * 0.5) - margin.right,
                    h = heightPerWin,
                })
                yOffset = yOffset + heightPerWin
            end
        end
    elseif index == 3 then
        return function(windows, screen, margin)
            -- Tall Layout
            local screenFrame = screen:frame()
            local mainWin = windows[1]
            local sideWins = { table.unpack(windows, 2) }

            mainWin:setFrame({
                x = screenFrame.x + (screenFrame.w * 0.3) + margin.left,
                y = screenFrame.y + margin.top,
                w = (screenFrame.w * 0.4) - margin.right,
                h = screenFrame.h - (margin.top + margin.bottom),
            })

            local widthPerWin = (screenFrame.w * 0.3) / #sideWins
            local xOffset = margin.left

            for _, win in ipairs(sideWins) do
                win:setFrame({
                    x = screenFrame.x + xOffset,
                    y = screenFrame.y + margin.top,
                    w = widthPerWin,
                    h = screenFrame.h - (margin.top + margin.bottom),
                })
                xOffset = xOffset + widthPerWin
            end
        end
    end
end

return Layouts
