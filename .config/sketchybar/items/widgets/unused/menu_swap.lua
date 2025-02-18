local colors = require("colors")
local settings = require("settings")
local icons = require("icons")
local app_icons = require("helpers.app_icons")



local menu_swap = sbar.add("item", "menu_swap", {
    bar = "left_bar",
    position = "left",
    background = {
        color = colors.transparent
    },
    label = {
        drawing = true,
        padding_left = 0,
        padding_right = 0,
        color = colors.quicksilver,
        font = {
            style = settings.font.style_map["Bold"],
        },
    },
    icon = {
        string = "<>",
        drawing = true,
        padding_left = 0,

        font = {
            style = settings.font.style_map["Bold"],
        },
    },
    updates = true,

})

menu_swap:subscribe("menu_swap_switched", function(env)
    sbar.animate("elastic", 10, function()
        menu_swap:set({
            label = {
                y_offset = 0,
                drawing = true,
                string = env.INFO,
                font = {
                    style = settings.font.style_map["Bold"],
                },
            },
            icon = {
                drawing = true,
                padding_right = 5,
                string = "<>",
 
            }
        })
    end)
end)

menu_swap:subscribe("mouse.entered", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 15, function()
        menu_swap:set({

            label = {
                drawing = false,
            },

            icon = {
                drawing = true,
                string = ">",
                padding_left = 5,
                padding_right = 5,
                color = colors.white,
                font = {
                    style = settings.font.style_map["Bold"],

                },
            },
            updates = true,
        })
    end)
end)



menu_swap:subscribe("mouse.exited", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 15, function()
        menu_swap:set({
            position = "left",
            background = {
                color = colors.transparent
            },
            label = {
                drawing = true,
                padding_left = 5,
                padding_right = 5,
                color = colors.quicksilver,

                font = {
                    style = settings.font.style_map["Bold"],
                },
            },
            icon = {
                drawing = true,
                color = colors.dimm_glow,
                font = {
                    style = settings.font.style_map["Bold"],
                },
                string = "<>",
            },
            updates = true,
        })
    end)
end)


menu_swap:subscribe("mouse.clicked", function(env)
    sbar.trigger("swap_menus_and_spaces")
    sbar.animate("elastic", 15, function()
        menu_swap:set({
            label = {
                padding_left = -50,
                drawing = false,
            },

            icon = {
                drawing = true,
                string = "􀍠",
                padding_left = 5,
                padding_right = 5,
                color = colors.white,
                font = {
                    style = settings.font.style_map["Bold"],

                },
            },
            updates = true,
        })
    end)
end)

return menu_swap
