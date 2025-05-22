local sbar     = require("sketchybar")
local colors   = require("colors")
local icons    = require("icons")
local settings = require("settings")

local adguard  =
	sbar.add(
		"item",
		{
			position = "right",
			icon = {
				align = "center",
				position = "center",
				padding_left = 15,
				padding_right = 10,
				string = "􁷥",
			},

		}
	)


adguard:subscribe("mouse.clicked", function(env)
	sbar.animate("sin", 15, function()
		adguard:set({
			click_script = "open -a AdGuard"

		})
	end)
end)

return adguard
