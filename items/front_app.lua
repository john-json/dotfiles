local colors = require("colors")
local settings = require(".config.sketchybar.settings")
local app_icons = require(".config.sketchybar.helperss.app_icons")



local front_app = sbar.add("item", "front_app", {
    bar = "left_bar",
    position = "left",
    padding_right = 10,
    background = {
        padding_right = 10,
        padding_left = 10,
        corner_radius = 6,
        color = colors.bar.bg,
    },
    label = {
        drawing = true,
        padding_left = 10,
        padding_right = 10,
        color = colors.grey,
        font = {
            style = settings.font.style_map["SemiBold"],
            size = 12.0,
        },
    },
    icon = {
        drawing = true,
        padding_left = 20,
        padding_right = 10,
        color = colors.puce,
        font = {

            style = settings.font.style_map["Bold"],
            size = 14.0,
        },
    },
    updates = true,

})

front_app:subscribe("mouse.entered", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 10, function()
        front_app:set({
            background = {
                padding_right = 10,
                padding_left = 10,
                corner_radius = 6,
                color = colors.bar.bg,
            },
            label = {
                drawing = false,
                padding_left = 10,
                padding_right = 10,

                color = colors.grey,
                font = {
                    style = settings.font.style_map["SemiBold"],
                    size = 14,
                },
            },

            icon = {
                drawing = true,
                string = "􀚅",
                padding_left = 5,
                padding_right = 10,
                color = colors.deep,
            },
            updates = true,
        })
    end)
end)


front_app:subscribe("front_app_switched", function(env)
    sbar.animate("elastic", 10, function()
        front_app:set({
            label = {
                drawing = true,
                string = env.INFO
            },
            icon = {
                drawing = true,
                padding_left = 0,
                padding_right = 15,
                string = " 􂨪 "
            }
        })
    end)
end)

front_app:subscribe("mouse.exited", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 10, function()
        front_app:set({
            position = "left",
            background = {

                color = colors.bar.bg,
            },
            label = {
                drawing = true,
                string = env.INFO
            },
            icon = {
                string = "􂨪",
                drawing = true,
                color = colors.puce,
                font = {

                    style = settings.font.style_map["Bold"],
                    size = 14.0,
                },
            },
            updates = true,
        })
    end)
end)


front_app:subscribe("mouse.clicked", function(env)
    sbar.trigger("swap_menus_and_spaces")
    sbar.animate("elastic", 10, function()
        front_app:set({
            position = "left",
            background = {

                color = colors.bar.bg,
            },
            label = {
                drawing = true,
                color = colors.grey,

            },
            icon = {
                drawing = true,

                font = {

                    style = settings.font.style_map["Bold"],
                    size = 14.0,
                },
            },
            updates = true,
        })
    end)
end)
