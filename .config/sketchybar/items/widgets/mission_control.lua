local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local mission_control   =
	sbar.add(
		"item",
		{
			position = "center",
			icon = {
				align = "center",
				position = "center",
				padding_left = 5,
				padding_right = 15,
				string = icons.mission_control,
				size = 16,
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
				font = {
					family = settings.font.numbers,
					size = 16,

				},
			},
		})
	end)
end)

mission_control:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 12, function()
		mission_control:set({

			icon = {
				font = {
					family = settings.font.numbers,
					size = 14,

				},
			},
		})
	end)
end)


return mission_control