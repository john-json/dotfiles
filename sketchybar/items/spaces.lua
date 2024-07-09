local colors = require("colors")
local icons = require("icons")
local settings = require("settings")
local app_icons = require("helpers.app_icons")

local space_colors = {

	colors.dolphin_grey5, -- Color for space 1
	colors.dolphin_grey4, -- Color for space 2
	colors.dolphin_grey3, -- Color for space 3
	colors.dolphin_grey2, -- Color for space 4
	colors.dolphin_grey, -- Color for space 5
	colors.dolphin_grey, -- Color for space 6
	colors.dolphin_grey2, -- Color for space 7
	colors.dolphin_grey3, -- Color for space 8
	colors.dolphin_grey4, -- Color for space 9
	colors.dolphin_grey5, -- Color for space 10


}


local function getSpaceColor(spaceNumber)
	return space_colors[spaceNumber]
end

local sf_icons_active = {
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
}

local sf_icons_inactive = {
	"", "", "", "", "", "", "", "", "", "",

}

local function getSpaceIcon(space, active, app_name)
	if active then
		return sf_icons_active[space]
	else
		return sf_icons_inactive[space]
	end
end

local spaces = {}

local function log(message)
	os.execute('echo "' .. message .. '" >> /tmp/sketchybar.log')
end

local function switchToSpace(spaceNumber)
	local scriptPath = string.format('"$CONFIG_DIR/items/scripts/switchSpace/switchToSpace%d.scpt"', spaceNumber)
	log("Switching to space: " .. spaceNumber .. " with script: " .. scriptPath)
	local command = "osascript " .. scriptPath
	log("Executing command: " .. command)
	local result = os.execute(command)
	log("Result: " .. tostring(result))
end

-- Create space items
for i = 1, 10, 1 do
	local space = sbar.add("space", "space." .. i, {
		space = i,
		position = "center",
		label = {
			drawing = false,
		},
		background = {
			drawing = true,
			corner_radius = 50,
			height = 12,
			color = colors.grey,
			padding_left = 10,
			padding_right = 10,
		},

	})
	spaces[i] = space

	space:subscribe("front_app_switched", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {
					padding_left = selected and 0 or 0,
					padding_right = selected and 0 or 0,

				},
				icon = {
					family = settings.font.numbers,
					align = "center",
					position = "center",
					y_offset = selected and 0 or 50,
					padding_left = selected and 15 or 5,
					padding_right = selected and 15 or 5,
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),
					font = {
						size = selected and 12 or 10,
					},
					color = selected and colors.dolphin_grey or getSpaceColor(i),

				},
				background = {
					y_offset = 0,
					drawing = true,
					corner_radius = selected and 25 or 22,
					color = colors.dolphin_grey,
					height = selected and 14 or 12,
					padding_left = selected and 8 or 10,
					padding_right = selected and 8 or 10,
				},

			})
		end)
	end)

	space:subscribe("mouse.entered", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {
					drawing = false,
				},
				icon = {
					family = settings.font.numbers,
					padding_left = selected and 3 or 4,
					padding_right = selected and 5 or 4,

					y_offset = selected and 0 or 0,

					align = "center",
					drawing = true,
					string = selected and "􀅼" or "􀄻",
					color = colors.bar.bg,

					font = {
						size = 14.
					},
				},
				background = {
					border_width = selected and 0 or 1,
					border_color = colors.dolphin_grey4,
					y_offset = 0,
					drawing = true,
					corner_radius = selected and 25 or 10,

					color = colors.dolphin_grey,
					height = selected and 18 or 18,
					padding_left = selected and 5 or 10,
					padding_right = selected and 5 or 10,
				},
			})
		end)
	end)

	space:subscribe("mouse.exited", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {
					padding_left = selected and 0 or 0,
					padding_right = selected and 0 or 0,

				},
				icon = {
					family = settings.font.numbers,
					align = "center",
					position = "center",
					y_offset = selected and 0 or 50,
					padding_left = selected and 15 or 5,
					padding_right = selected and 15 or 5,
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),
					font = {
						size = selected and 12 or 10,
					},
					color = selected and colors.dolphin_grey or getSpaceColor(i),

				},
				background = {
					y_offset = 0,
					drawing = true,
					corner_radius = selected and 25 or 22,
					color = colors.dolphin_grey,
					height = selected and 14 or 12,
					padding_left = selected and 8 or 10,
					padding_right = selected and 8 or 10,
				},
			})
		end)
	end)

	-- local space_popup = sbar.add("item", {
	-- 	position = "popup." .. space.name,
	-- 	padding_left = 5,
	-- 	padding_right = 0,
	-- 	background = {
	-- 		drawing = true,
	-- 		image = {
	-- 			corner_radius = 9,
	-- 			scale = 0.2
	-- 		}
	-- 	}
	-- })

	space:subscribe("mouse.clicked", function(env)
		local selected = env.SELECTED == "true"
		log("Clicked space: " .. i)
		switchToSpace(i)
		local new_space = sbar.add("item", {
			icon = {
				click_script = selected and sbar.exec('osascript "$CONFIG_DIR/items/scripts/newSpace.scpt"'),
			},

			background = {
				border_color = colors.dolphin_grey,
				y_offset = 0,
				drawing = true,
				padding_left = selected and 10 or 10,
				padding_right = selected and 18 or 10,
			},
		})
	end)
end





local space_names = {}
for i = 1, 10 do
	table.insert(space_names, spaces[i].name)
end
sbar.add("bracket", space_names, {

	background = {
		corner_radius = 6,
		color = colors.bar.bg,
		width = "dynamic"

	},
})
