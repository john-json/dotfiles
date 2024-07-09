local colors = require("colors")
local icons = require("icons")
local settings = require("settings")



local apple = sbar.add("item", {
	display = 1,
	label = {
		y_offset = 50,
		string = "",
		padding_right = 5,
	},
	icon = {
		padding_left = 10,
		font = {
			size = 16,
		},
		string = icons.apple,
		color = colors.dolphin_grey,

	},

	background = {
		border_width = 1,
		border_color = colors.bar.border,
		color = colors.bar.bg,
	},

	click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
})

apple:subscribe("mouse.entered", function(env)
	local selected = env.SELECTED == "true"
	sbar.animate("elastic", 10, function()
		apple:set({

			label = {
				drawing = false,
				y_offset = 0,
				color = colors.desert_sand,
				padding_right = 10,
				string = icons.apple,
				padding_left = 10,
				font = {
					size = 16,
				},
			},
			icon = {
				padding_right = 10,
				padding_left = 10,
				drawing = true,
				color = colors.bar.bg,
				string = icons.apple,
				font = {
					size = 16,
				},

			},
			background = {
				border_width = 1,
				border_color = colors.bar.border,
				color = colors.dolphin_grey,
			},
		})
	end)
end)

apple:subscribe("mouse.exited", function(env)
	sbar.animate("elastic", 10, function()
		apple:set({
			display = 1,
			label = {
				y_offset = 50,
				string = icons.apple,
				padding_right = 0,
				padding_left = 10,
			},
			icon = {
				padding_left = 8,
				padding_right = 10,
				font = {
					size = 16,
				},
				string = icons.apple,
				color = colors.dolphin_grey,

			},

			background = {
				border_width = 0.5,
				border_color = colors.bar.border,
				color = colors.bar.bg,
			},

			click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
		})
	end)
end)
apple:subscribe("mouse.clicked", function(env)
	sbar.animate("elastic", 10, function()
		apple:set({
			label = {
				y_offset = 50,
				string = icons.apple,
				padding_right = 0,
				padding_left = 10,
			},
			icon = {
				drawing = true,
				padding_left = 8,
				font = {
					size = 16,
				},
				string = icons.apple,
				color = colors.dolphin_grey,

			},

			background = {

				color = colors.bar.bg,
			},

			click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s 0",
		})
	end)
end)
