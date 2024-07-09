local colors = require("colors")
local settings = require("settings")
local app_icons = require("helpers.app_icons")



local front_app = sbar.add("item", "front_app", {

    position = "left",
    background = {

        color = colors.bar.bg,
    },
    label = {
        padding_left = 10,
        padding_right = 10,
        color = colors.foreground_light,
        font = {
            style = settings.font.style_map["Bold"],
            size = 12.0,
        },
    },
    icon = {
        color = colors.red,
        font = {

            style = settings.font.style_map["Bold"],
            size = 16.0,
        },
    },
    updates = true,

})

front_app:subscribe("mouse.entered", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 10, function()
        front_app:set({

            label = {
                padding_left = 10,
                padding_right = 10,
                color = colors.red,
                font = {
                    style = settings.font.style_map["Bold"],
                    size = 12.0,
                },
            },
        })
    end)
end)

front_app:subscribe("mouse.exited", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 10, function()
        front_app:set({

            label = {
                padding_right = 10,
                color = colors.bar.foreground,
                font = {
                    style = settings.font.style_map["Bold"],
                    size = 12.0,
                },
            },
        })
    end)
end)

front_app:subscribe("front_app_switched", function(env)
    sbar.animate("elastic", 10, function()
        front_app:set({
            label = { string = env.INFO },
            icon = {
                padding_left = 0,
                padding_right = 10,
                string = " ❯"
            }
        })
    end)
end)


front_app:subscribe("mouse.clicked", function(env)
    sbar.trigger("swap_menus_and_spaces")
end)
