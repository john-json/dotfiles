local colors = require("colors")
local settings = require("settings")
local icons = require("icons")
local app_icons = require("helpers.app_icons")


local force_quit = sbar.add("Force Quit", icons.circle_quit,       
'osascript -e tell "app "Terminal" to close front window"')


local front_app = sbar.add("item", "front_app", {
    bar = "left_bar",
    position = "left",
    background = {
        color = colors.transparent
    },
    label = {
        drawing = true,
        padding_left = 5,
        padding_right = 10,
        color = colors.quicksilver,
        font = {
            style = settings.font.style_map["Bold"],
        },
    },
    icon = {
        drawing = false,
   
        font = {
            style = settings.font.style_map["Bold"],
        },
    },
    updates = true,

})

front_app:subscribe("front_app_switched", function(env)
    sbar.animate("elastic", 10, function()
        front_app:set({
            label = {
                y_offset = 0,
                drawing = true,
                string = env.INFO,
                font = {
                    style = settings.font.style_map["Bold"],
                },
            },
            icon = {
                drawing = false,
                padding_right = 10,
                string = "X"
            }
        })
    end)
end)

front_app:subscribe("mouse.entered", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 15, function()
        front_app:set({

            label = {
                drawing = false,
            },

            icon = {
                click_script = force_quit,
                drawing = true,
                string = "Menu",
                padding_left = 5,
                padding_right = 10,
                color = colors.quicksilver,
                font = {
                    style = settings.font.style_map["Bold"],

                },
            },
            updates = true,
        })
    end)
end)



front_app:subscribe("mouse.exited", function(env)
    local selected = env.SELECTED == "true"
    sbar.animate("elastic", 10, function()
        front_app:set({
            position = "left",
            background = {
                color = colors.transparent
            },
            label = {
                drawing = true,
                padding_left = 5,
                padding_right = 10,
                color = colors.quicksilver,
                font = {
                    style = settings.font.style_map["Bold"],
                },
            },
            icon = {
                drawing = false,
                font = {
                    style = settings.font.style_map["Bold"],
                },
                string = "X",
            },
            updates = true,
        })
    end)
end)


front_app:subscribe("mouse.clicked", function(env)
    sbar.trigger("swap_menus_and_spaces")
    sbar.animate("elastic", 10, function()
        front_app:set({
            label = {
                drawing = true,
                string = "X",
            },

            icon = {
                drawing = true,
                string = "X",
                padding_left = 5,
                padding_right = 10,
                color = colors.white,
                font = {
                    style = settings.font.style_map["Bold"],

                },
            },
        
            updates = true,
        })
    end)
end)

return front_app
