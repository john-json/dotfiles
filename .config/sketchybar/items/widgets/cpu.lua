ocal icons = require("icons")
local colors = require("colors")
local settings = require("settings")

-- Execute the event provider binary which provides the event "cpu_update" for
-- the cpu load data, which is fired every 2.0 seconds.
sbar.exec("killall cpu_load >/dev/null; $CONFIG_DIR/helpers/event_providers/cpu_load/bin/cpu_load cpu_update 2.0")

local cpu = sbar.add("graph", "widgets.cpu", 42, {
    position = "right",
    display = 1,
    background = {
        color = { alpha = 0 },
        border_color = { alpha = 0 },
        drawing = true,
    },
    icon = {
        string = icons.cpu,

    },

    label = {
        string = "cpu ??%",
        font = {
            family = settings.font.numbers,
            style = settings.font.style_map["Bold"],
        },
        align = "right",
        padding_left = settings.paddings,
        width = 20,
    },
    padding_right = settings.paddings + 6
})

cpu:subscribe("cpu_update", function(env)
    -- Also available: env.user_load, env.sys_load
    local load = tonumber(env.total_load)
    cpu:push({ load / 100. })

    cpu:set({
        graph = {
            color = colors.transparent
        },
        label = "cpu " .. env.total_load .. "%",
    })
end)

cpu:subscribe("mouse.clicked", function(env)
    sbar.exec("open -a 'Activity Monitor'")
end)

-- Background around the cpu item
sbar.add("bracket", "widgets.cpu.bracket", { cpu.name }, {
    background = { color = colors.transparent }
})

-- Background around the cpu item
sbar.add("item", "widgets.cpu.padding", {
    position = "right",
    width = settings.group_paddings
})

return cpu