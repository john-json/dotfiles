local colors = require("colors")
local icons = require("icons")
local settings = require("settings")

local popup_width = 240
-- Main Apple icon to trigger popup


local apple = sbar.add("item", {
	position = "left",
	bar = "left_bar",
	background = {
		border_width = 0,
		border_color = colors.bar.border
	},
	icon = {
		string = "􀆈",
		color = colors.grey,
		padding_left = 5,
		padding_right = 10,
		size = 18,
	},
	popup = {
		align = "left",
		horizontal = false,
		height = "dynamic",
		width = popup_width,
	}
})

-- Hover effect
apple:subscribe("mouse.entered", function()
	sbar.animate("elastic", 12, function()
		apple:set({
			icon = {
				size = 20,
				color = colors.darkGrey,
			},
		})
	end)
end)

apple:subscribe("mouse.exited", function()
	sbar.animate("elastic", 12, function()
		apple:set({
			icon = {
				size = 18,
				color = colors.white,
			},
		})
	end)
end)



-- Helper function to create menu items with hover effect
local function create_menu_item(position, label, icon_string, click_command)
	local item = sbar.add("item", {
		position = position,
		icon = {
			string = icon_string,
			font = { size = 16 },
			padding_left = 5,
			padding_right = 15,
			color = colors.white,
		},
		label = {
			string = label,
			color = colors.white,
			padding_left = 10,
			padding_right = 20,
			align = "left",
			font = { size = 12 }
		},
		background = {
			padding_left = 10,
			padding_right = 20,
			color = colors.transparent,
			height = 40, -- Reduced height for compactness
			width = popup_width

		},
		click_script = click_command
	})

	-- Hover effect
	item:subscribe("mouse.entered", function()
		sbar.animate("elastic", 15, function()
			item:set({
				icon = {
					padding_left = 5,
					padding_right = 15,
					color = colors.darkGrey,
					font = { size = 20 },
				},
				label = {
					color = colors.darkGrey,
					padding_left = 10,
					padding_right = 20,
					align = "left",
					font = { size = 12, style = "Bold" }
				},
			})
		end)
	end)
	item:subscribe("mouse.exited", function()
		sbar.animate("elastic", 15, function()
			item:set({
				icon = {
					color = colors.popup.icons,
					padding_left = 5,
					padding_right = 20,
					font = { size = 14 },
					color = colors.white,
				},
				label = {
					padding_left = 10,
					padding_right = 20,
					string = label,
					color = colors.white,
					align = "left",
					font = { size = 12 }
				},
			})
		end)
	end)

	return item
end

-- Add each custom menu entry to the popup
local about_mac = create_menu_item("popup." .. apple.name, "About", icons.apple,
	"open -a 'About This Mac'")
local system_settings = create_menu_item("popup." .. apple.name, "Settings", icons.circle_gear,
	"open -a 'System Preferences'")
local force_quit = create_menu_item("popup." .. apple.name, "Force Quit", icons.circle_quit,
	"osascript -e 'tell application \"System Events\" to keystroke \"q\" using {command down}'")
local sleep = create_menu_item("popup." .. apple.name, "Sleep", icons.circle_sleep, "pmset displaysleepnow")
local restart = create_menu_item("popup." .. apple.name, "Restart", icons.circle_restart,
	"osascript -e 'tell app \"System Events\" to restart'")
local shutdown = create_menu_item("popup." .. apple.name, "Power off", icons.circle_shutdown,
	"osascript -e 'tell app \"System Events\" to shut down'")

-- Toggles popup on click
apple:subscribe("mouse.clicked", function(env)
	sbar.animate("elastic", 15, function()
		apple:set({
			popup = {
				y_offset = 5,
				height = 0,
				drawing = "toggle"
			}
		})
	end)
end)

-- Hides popup on mouse exit
apple:subscribe("mouse.exited.global", function(env)
	sbar.animate("elastic", 15, function()
		apple:set({
			popup = {
				y_offset = -40,
				height = 0,
				drawing = false
			}
		})
	end)
end)


return apple