local colors = require("colors")
local icons = require("icons")
local settings = require(".config.sketchybar.settings")
local iconPath1 = "/items/multi_color/apple.logo.png"


local apple = sbar.add("item", {
	display = 1,
	bar = "left_bar",
	icon = {
		drawing = true,
		padding_left = 8,
		padding_right = 5,
		font = {
			size = 14,
		},
		string = icons.apple,
		color = colors.icon.background,

	},
	background = {

		color = colors.transparent,

	},


	click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
})

apple:subscribe("mouse.entered", function(env)
	local selected = env.SELECTED == "true"
	sbar.animate("elastic", 10, function()
		apple:set({
			icon = {
				padding_left = 8,
				padding_right = 5,
				drawing = true,
				string = icons.apple,
				color = colors.icon.hover,
				font = {
					size = 14,
				},
			},
		})
	end)
end)

apple:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 10, function()
		apple:set({
			display = 1,
			icon = {
				drawing = true,
				padding_left = 8,
				padding_right = 5,
				font = {
					size = 14,
				},
				string = icons.apple,
				color = colors.icon.background,

			},
			background = {

				color = colors.transparent,

			},

			click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
		})
	end)
end)
apple:subscribe("mouse.clicked", function(env)
	sbar.animate("elastic", 10, function()
		apple:set({

			icon = {

				padding_left = 8,
				padding_right = 5,

				string = icons.apple,
				color = colors.icon.background,

			},

			click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
		})
	end)
end)
