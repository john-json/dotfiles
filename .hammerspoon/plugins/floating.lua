local Floating = {}
Floating.floatingWindows = {}

function Floating.toggleFloating()
    local win = hs.window.focusedWindow()
    if not win then return end

    local winId = win:id()
    if Floating.floatingWindows[winId] then
        Floating.floatingWindows[winId] = nil
        hs.alert.show("Tiling Mode")
        require("plugins.layout").arrangeWindows()
    else
        Floating.floatingWindows[winId] = true
        hs.alert.show("Floating Mode")
    end
end

function Floating.isFloating(win)
    return Floating.floatingWindows[win:id()] ~= nil
end

return Floating
