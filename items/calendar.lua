local settings = require(".config.sketchybar.settings")
local colors = require("colors")




local cal =
    sbar.add(
        "item",
        {
            bar = "middle_bar",
            display = 1,
            position = "center",
            label = {
                y_offset = -2,
                align = "center",
                position = "center",
                padding_right = 10,
                padding_left = 10,
                background = {
                    border_width = 0,
                    height = 28,
                    corner_radius = 6,
                    color = colors.transparent,
                },
                color = colors.magenta_dark,
                font = {
                    family = settings.font.numbers,
                    style = settings.font.style_map["SemiBold"],
                    size = 16
                }
            },

            icon = {
                padding_left = 10,
                padding_right = 0,
                align = "left",
                color = colors.icon.background,
                font = {
                    style = settings.font.style_map["Regualr"],
                    size = 12
                }
            },
            update_freq = 30,
            background = {

                -- color = colors.bar.transparent,
                color = colors.bar.bg2,
                corner_radius = 25,
                border_width = 0,
                border_color = colors.bar.border,

            },
            blur_radius = 10,

            width = "dynamic",

        }

    )

cal:subscribe(
    { "forced", "routine", "system_woke" },
    function(env)
        cal:set(
            {
                icon = os.date("%a %d,  %H"),
                label = os.date("%M"),
            }
        )
    end
)

cal:subscribe(
    "mouse.clicked",
    function(env)
        sbar.exec("open -a 'Calendar'")
    end
)
