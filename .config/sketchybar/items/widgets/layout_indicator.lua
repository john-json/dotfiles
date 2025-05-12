local update_layout = function()
    local handle = io.popen("yabai -m query --spaces --space | jq -r '.type'")
    local layout = handle:read("*a")
    handle:close()

    layout = layout:gsub("%s+", "") -- clean whitespace

    local icon = "?"
    if layout == "bsp" then
        icon = " BSP"
    elseif layout == "stack" then
        icon = " Stack"
    elseif layout == "float" then
        icon = "󰘔 Float"
    end

    sketchybar.update("layout_indicator", { label = icon })
end

return {
    update = update_layout
}
