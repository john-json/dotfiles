local Floating = {}
local fadeDuration = 0.2 -- Speed of fade in/out

Floating.floatingWindows = {}

function Floating.toggleFloating()
    local win = hs.window.focusedWindow()
    if not win then return end

    local winId = win:id()
    if Floating.floatingWindows[winId] then
        -- Remove from floating, fade out first
        hs.timer.doAfter(fadeDuration, function()
            Floating.floatingWindows[winId] = nil
            require("hhtwm").arrange()
        end)

        if win.setAlpha then -- Ensure `setAlpha` is valid
            win:setAlpha(0.2)
            hs.timer.doAfter(fadeDuration, function() win:setAlpha(1.0) end)
        end

        hs.alert.show("Tiling Mode")
    else
        -- Add to floating, fade in
        Floating.floatingWindows[winId] = true

        if win.setAlpha then -- Ensure `setAlpha` is valid
            win:setAlpha(0.2)
            hs.timer.doAfter(fadeDuration, function() win:setAlpha(1.0) end)
        end

        hs.alert.show("Floating Mode")
    end
end

function Floating.isFloating(win)
    return Floating.floatingWindows[win:id()] ~= nil
end

hs.hotkey.bind({ "alt", "ctrl" }, "T", Floating.toggleFloating) -- Toggle floating mode

return Floating
