local Utils = require("plugins.utils")
local Animations = require("plugins.animations")

local Layout = {}
Layout.layouts = {"single", "split", "grid"}
Layout.currentLayout = 1

function Layout.arrangeWindows()
    local screenWindows = Utils.getWindowsByScreen()

    for screenId, windows in pairs(screenWindows) do
        local screen = hs.screen.find(screenId)
        if not screen then goto continue end
        local screenFrame = screen:frame()
        local numWindows = #windows

        -- Skip floating windows
        local tilingWindows = {}
        for _, win in ipairs(windows) do
            if not Utils.isFloating(win) then
                table.insert(tilingWindows, win)
            end
        end

        numWindows = #tilingWindows

        if Layout.layouts[Layout.currentLayout] == "single" or numWindows == 1 then
            Utils.centerWindow(tilingWindows[1])

        elseif Layout.layouts[Layout.currentLayout] == "split" or numWindows == 2 then
            Utils.splitScreen(tilingWindows, screenFrame)

        elseif Layout.layouts[Layout.currentLayout] == "grid" or numWindows >= 3 then
            Utils.gridLayout(tilingWindows, screenFrame)
        end

        for _, win in ipairs(tilingWindows) do
            Animations.fadeInWindow(win)
        end

        ::continue::
    end
end

function Layout.cycleLayout(direction)
    Layout.currentLayout = ((Layout.currentLayout - 1 + direction) % #Layout.layouts) + 1
    hs.alert.show("Layout: " .. Layout.layouts[Layout.currentLayout])
    Layout.arrangeWindows()
end

return Layout