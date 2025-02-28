local sbar      = require("sketchybar")
local colors    = require("colors")
local icons     = require("icons")
local settings  = require("settings")

local add_space =
	sbar.add(
		"item",
		{
			position = "center",
			icon = {
				align = "center",
				position = "center",
				padding_left = 15,
				padding_right = 10,
				string = icons.plus,
			},
			label = {
				drawing = false,
			},

		}
	)


add_space:subscribe("mouse.entered", function(env)
	sbar.animate("sin", 15, function()
		add_space:set({
			icon = {
				color = colors.orange,
				font = {
					family = settings.font.numbers,
					size = 18,

				},
				click_csript = 'osascript -e "$CONFIG_DIR/items/scripts/switchSpace/newSpace.scpt"'
			},
		})
	end)
end)

add_space:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 12, function()
		add_space:set({

			icon = {
				color = colors.icon.primary,
				font = {
					size = 14,
					family = settings.font.numbers,

				},
			},
		})
	end)
end)


return add_space
