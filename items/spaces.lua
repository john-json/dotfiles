local colors = require("colors")
local icons = require("icons")
local settings = require(".config.sketchybar.settings")
local app_icons = require(".config.sketchybar.helperss.app_icons")

local space_colors = {


	colors.nickel,  -- Color for space 1
	colors.rocket,  -- Color for space 2
	colors.puce,    -- Color for space 4
	colors.magenta, -- Color for space 5
	colors.deep,    -- Color for space 6
	colors.nickelblue, -- Color for space 7
	colors.auro,    -- Color for space 8
	colors.rocket,  -- Color for space 9
	colors.pastel,  --Color for Space 10
	colors.orange,  -- Color for space 0



}


local function getSpaceColor(spaceNumber)
	return space_colors[spaceNumber]
end

local sf_icons_active = {
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
	-- "􀝜", "􀝜", "􀝜", "􀝜", "􀝜", "􀝜", "􀝜", "􀝜", "􀝜", "􀝜",
}

local sf_icons_inactive = {
	"1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
	-- "􁹨", "􁹨", "􁹨", "􁹨", "􁹨", "􁹨", "􁹨", "􁹨", "􁹨", "􁹨",
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
		bar = "left_bar",
		space = i,
		position = "left",

		icon = {
			color = colors.bar.foreground,
			drawing = true,
			padding_left = 2,
			padding_right = 2,


		},

		background = {
			drawing = true,
			y_offset = -20,
			padding_left = 12,
			padding_right = 12,
			corner_radius = 25,
		},
	})
	spaces[i] = space

	space:subscribe("front_app_switched", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {

					padding_left = selected and 10 or 5,
					padding_right = selected and 10 or 5,
				},
				icon = {
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),
					colors = selected and getSpaceColor(i),
					drawing = false,
				},
				background = {
					border_width = 1,
					border_color = getSpaceColor(i),
					drawing = true,
					y_offset = 0,
					height = selected and 12 or 10,
					color = selected and getSpaceColor(i) or colors.bar.bg2,

				},

			})
		end)
	end)

	space:subscribe("mouse.entered", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 8, function()
			space:set({
				label = {
					string = selected and "􀅼" or "􀄳",
					drawing = true,
					color = colors.puce,
					padding_left = 5,
					padding_right = 5,
				},



				background = {
					y_offset = -50,
					height = 8,
					color = colors.white,

				},
			})
		end)
	end)

	space:subscribe("mouse.exited", function(env)
		local selected = env.SELECTED == "true"
		sbar.animate("elastic", 10, function()
			space:set({
				label = {

					padding_left = 5,
					padding_right = 5,
				},
				icon = {
					string = selected and getSpaceIcon(i, true) or getSpaceIcon(i, false),
					colors = selected and getSpaceColor(i),
					drawing = false,
				},
				background = {
					border_width = 1,
					border_color = getSpaceColor(i),
					drawing = true,
					y_offset = 0,
					height = 10,
					color = selected and getSpaceColor(i) or colors.bar.bg2,

				},
			})
		end)
	end)

	space:subscribe("mouse.clicked", function(env)
		local selected = env.SELECTED == "true"
		log("Clicked space: " .. i)
		switchToSpace(i)
		local new_space = sbar.add("item", {
			icon = {
				click_script = selected and sbar.exec('osascript "$CONFIG_DIR/items/scripts/newSpace.scpt"'),
			},

			background = {
				height = selected and 10 or 10,
				color = selected and colors.olive_light or colors.olive,
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
		height = 26,
		corner_radius = 25,
		border_width = 0,
		border_color = colors.bar.border,
		color = colors.bar.bg2,
		width = "dynamic"

	},
})
