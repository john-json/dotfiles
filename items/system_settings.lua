-------------------MENU INDICATOR ICON-----------------
-------------------------------------------------------
local colors = require("colors")
local icons = require("icons")
local settings = require(".config.sketchybar.settings")



local settings =
    sbar.add(
        "item",
        {
            bar = "right_bar",
            position = "right",
            align = "center",

            icon = {
                string = "|",
                color = colors.black,
                padding_right = 5,
            },
            label = {
                y_offset = 0,
                padding_left = 5,
                padding_right = 5,
                color = colors.icon.background,
                string = "􀺺",
                font = {
                    size = 18
                }

            },
            background = {
                height = 30,
                border_width = 0,
                color = colors.bar.bg2,
                corner_radius = 6,

            }
        }
    )

settings:subscribe(
    "mouse.entered",
    function(env)
        local selected = env.SELECTED == "true"
        sbar.animate(
            "elastic",
            15,
            function()
                settings:set(
                    {
                        label = {
                            padding_left = 5,
                            padding_right = 5,
                            color = colors.bar.foreground,
                            string = "􀺻",
                            font = {
                                size = 18
                            }

                        },
                        background = {
                            height = 30,
                            border_width = 0,
                            color = colors.bar.bg2,
                            corner_radius = 6,

                        }
                    }
                )
            end
        )
    end)

settings:subscribe(
    "mouse.exited",
    function(env)
        local selected = env.SELECTED == "true"
        sbar.animate(
            "elastic",
            15,
            function()
                settings:set(
                    {
                        label = {
                            padding_left = 5,
                            padding_right = 5,
                            color = colors.red,
                            string = "􀺻",
                            font = {
                                size = 18
                            }

                        },
                        background = {
                            height = 30,
                            border_width = 0,
                            color = colors.bar.bg2,
                            corner_radius = 6,

                        }
                    }
                )
            end
        )
        -- Animate the menu items when they show up
    end
)

-- Define a variable to keep track of the icon state
local iconState = false

settings:subscribe(
    "mouse.clicked",
    function(env)
        sbar.exec("open -a 'System Settings'")
    end
)
