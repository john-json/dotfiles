local Utils = require("plugins.utils")
local Animations = require("plugins.animations")
local Floating = require("plugins.floating")

local Layout = {}
Layout.layouts = { "default", "tall", "floating" }
Layout.currentLayout = {}

function Layout.getActiveScreen()
    local focusedWin = hs.window.focusedWindow()
    return focusedWin and focusedWin:screen() or hs.screen.mainScreen()
end

function Layout.arrangeWindows()
    local activeScreen = Layout.getActiveScreen()
    local screenFrame = activeScreen:frame()
    local screenId = activeScreen:id()

    -- Get windows only on the active screen
    local allWindows = hs.window.allWindows()
    local windows = {}
    for _, win in ipairs(allWindows) do
        if win:screen():id() == screenId and not Floating.isFloating(win) then
            table.insert(windows, win)
        end
    end

    local numWindows = #windows
    local targetFrames = {}

    -- Ensure a layout is assigned to the screen
    if not Layout.currentLayout[screenId] then
        Layout.currentLayout[screenId] = "default"
    end

    local layoutType = Layout.currentLayout[screenId]

    -- If no windows, don't rearrange
    if numWindows == 0 then return end

    if numWindows == 1 then
        -- Open new window centered with max screen size (your provided values)
        targetFrames = {
            { x = screenFrame.x + 942, y = screenFrame.y + 225, w = 1515, h = 983 }
        }
    elseif numWindows == 2 then
        -- Split 50/50
        local left = { x = screenFrame.x, y = screenFrame.y, w = screenFrame.w / 2, h = screenFrame.h }
        local right = {
            x = screenFrame.x + screenFrame.w / 2,
            y = screenFrame.y,
            w = screenFrame.w / 2,
            h = screenFrame
                .h
        }
        targetFrames = { Utils.applyPadding(left, screenFrame), Utils.applyPadding(right, screenFrame) }
    elseif numWindows == 3 then
        -- Master on left, two stacked on right
        local left = { x = screenFrame.x, y = screenFrame.y, w = screenFrame.w / 2, h = screenFrame.h }
        local topRight = {
            x = screenFrame.x + screenFrame.w / 2,
            y = screenFrame.y,
            w = screenFrame.w / 2,
            h =
                screenFrame.h / 2
        }
        local bottomRight = {
            x = screenFrame.x + screenFrame.w / 2,
            y = screenFrame.y + screenFrame.h / 2,
            w =
                screenFrame.w / 2,
            h = screenFrame.h / 2
        }
        targetFrames = { Utils.applyPadding(left, screenFrame), Utils.applyPadding(topRight, screenFrame), Utils
            .applyPadding(bottomRight, screenFrame) }
    else
        -- Tall layout (vertical split)
        local colWidth = screenFrame.w / numWindows
        for i, _ in ipairs(windows) do
            local col = { x = screenFrame.x + (i - 1) * colWidth, y = screenFrame.y, w = colWidth, h = screenFrame.h }
            table.insert(targetFrames, Utils.applyPadding(col, screenFrame))
        end
    end

    -- Apply animations (like Hyperland)
    Animations.animateLayoutTransition(windows, targetFrames, 0.12, 6)
end

function Layout.cycleLayout()
    local screen = Layout.getActiveScreen()
    local screenId = screen:id()

    local layoutIndex = 1
    for i, layout in ipairs(Layout.layouts) do
        if Layout.currentLayout[screenId] == layout then
            layoutIndex = i
            break
        end
    end

    layoutIndex = (layoutIndex % #Layout.layouts) + 1
    Layout.currentLayout[screenId] = Layout.layouts[layoutIndex]

    hs.alert.show("Layout: " .. Layout.currentLayout[screenId])
    Layout.arrangeWindows()
end

return Layout
