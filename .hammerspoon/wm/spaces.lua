local Spaces = {}

function Spaces.moveWindowToSpace(direction)
    local win = hs.window.focusedWindow()
    if not win then return end

    local currentSpace = hs.spaces.windowSpaces(win) and hs.spaces.windowSpaces(win)[1]
    if not currentSpace then return end

    local allSpaces = hs.spaces.allSpaces()
    local index = hs.fnutils.indexOf(allSpaces, currentSpace)

    if index then
        local newIndex = index + (direction == "left" and -1 or 1)
        local newSpace = allSpaces[newIndex]

        if newSpace then
            hs.spaces.moveWindowToSpace(win, newSpace) -- ✅ Corrected function
            hs.spaces.gotoSpace(newSpace)              -- Switch to the new space
        end
    end
end

return Spaces
