local sbar            = require("sketchybar")
local colors          = require("colors")
local icons           = require("icons")
local settings        = require("settings")

local mission_control =
	sbar.add(
		"item",
		{
			position = "center",
			icon = {
				align = "center",
				position = "center",
				padding_left = 3
				,
				padding_right = 10,
				string = icons.mission_control,
			},
			label = {
				drawing = false,
				padding_right = 10,
			}

		}
	)

mission_control:subscribe(
	"mouse.clicked",
	function(env)
		sbar.exec("open -a 'Mission Control'")
	end
)

mission_control:subscribe("mouse.entered", function(env)
	sbar.animate("elastic", 12, function()
		mission_control:set({
			icon = {
				color = colors.orange,
				font = {
					family = settings.font.numbers,
					size = 18,

				},
			},
		})
	end)
end)

mission_control:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 12, function()
		mission_control:set({

			icon = {
				color = colors.icon.primary,
				font = {
					family = settings.font.numbers,

				},
			},
		})
	end)
end)


return mission_control
