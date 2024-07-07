local colors = require("colors")
local icons = require("icons")
local settings = require("settings")
local app_icons = require("helpers.app_icons")

local space_colors = {
	colors.red,   -- Color for space 1
	colors.orange, -- Color for space 2
	colors.blue,  -- Color for space 3
	colors.yellow, -- Color for space 4
	colors.turquise, -- Color for space 5
	colors.yellow, -- Color for space 6
	colors.red,   -- Color for space 7
	colors.blue,  -- Color for space 8
	colors.green, -- Color for space 9
	colors.yellow, -- Color for space 10

}

local function getSpaceColor(spaceNumber)
	return space_colors[spaceNumber]
end

local sf_icons_active = {
	" ",
}

local sf_icons_inactive = {
	"􀀁", "􀀁", "􀀁", "􀀁", "􀀁", "􀀁", "􀀁", "􀀁", "􀀁", "􀀁", -- Add icons for inactive spaces if needed
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



for i = 1, 10 do
	local space = sbar.add("space", "space." .. i, {
		space = i,
		position = "center",
	})
	spaces[i] = space

	space:subscribe("front_app_switched", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {
					position = "center",
					align = "center",
					drawing = true,
					padding_left = selected and 10 or 0,
					padding_right = selected and 10 or 0,

				},
				icon = {
					drawing = selected and false or true,
					position = "center",
					align = "center",
					padding_left = selected and 0 or 0,
					padding_right = selected and 0 or 0,
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),
					y_offset = selected and 50 or 0,
					font = {
						font = "sketchybar-app-font:Regular:12.0",
						size = selected and 12 or 10,

					},
					color = selected and colors.dolphin_grey or colors.lightgrey,
				},
				background = {
					position = "center",
					align = "center",
					padding_left = selected and 5 or 5,
					padding_right = selected and 3 or 5,

					height = 14,
					corner_radius = selected and 6 or 0,
					color = selected and colors.dolphin_grey or colors.bar.transparent,

				},
			})
		end)
	end)

	space:subscribe("mouse.entered", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {
					position = "center",
					align = "center",
					drawing = true,
				},
				icon = {
					drawing = true,
					position = "center",
					align = "center",
					y_offset = 0,
					color = colors.dolphin_grey,
					string = selected and "􀁍" or "􀁱",

					font = {
						font = "sketchybar-app-font:Regular:16.0",
						size = selected and 16 or 16,
					},
				},
				background = {
					position = "center",
					align = "center",
					color = colors.bar.transparent,
					height = 28,
					-- corner_radius = selected and 4 or 4,
					padding_left = selected and 5 or 0,
					padding_right = selected and 5 or 0,
				},
			})
		end)
	end)

	space:subscribe("mouse.exited", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {
					position = "center",
					align = "center",
					drawing = true,
					padding_left = selected and 5 or 0,
					padding_right = selected and 5 or 0,

				},
				icon = {
					drawing = selected and false or true,
					position = "center",
					align = "center",
					y_offset = selected and 50 or 0,
					padding_left = selected and 2 or 0,
					padding_right = selected and 2 or 0,
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),

					font = {
						font = "sketchybar-app-font:Regular:12.0",
						size = selected and 14 or 10,

					},
					color = selected and colors.dolphin_grey or colors.lightgrey,
				},
				background = {
					position = "center",
					align = "center",
					padding_left = selected and 5 or 5,
					padding_right = selected and 3 or 5,

					height = 14,
					corner_radius = selected and 6 or 0,
					color = selected and colors.dolphin_grey or colors.bar.transparent,

				},
			})
		end)
	end)

	space:subscribe("mouse.clicked", function(env)
		local selected = env.SELECTED == "true"
		log("Clicked space: " .. i)
		switchToSpace(i)
		icon = {
			click_script = selected and sbar.exec('osascript "$CONFIG_DIR/items/scripts/newSpace.scpt"'),
		}
	end)
end



local space_names = {}
for i = 1, 10 do
	table.insert(space_names, spaces[i].name)
end
sbar.add("bracket", space_names, {
	background = {
		color = colors.bar.bg,
		padding_left = 20,
		padding_right = 20,

	},
})
