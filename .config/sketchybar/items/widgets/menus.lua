local colors = require("colors")
local icons = require("icons")
local settings = require("settings")
local app_icons = require("helpers.app_icons")


local menu_watcher =
    sbar.add(
        "item",
        {
            drawing = false,
            updates = false
        }
    )
local space_menu_swap =
    sbar.add(
        "item",
        {
            drawing = false,
            updates = true
        }
    )
sbar.add("event", "swap_menus_and_spaces")

local max_items = 15
local menu_items = {}
for i = 1, max_items, 1 do
    local menu =
        sbar.add(
            "item",
            "menu." .. i,
            {
                drawing = false,
                icon = {
                    drawing = false
                },
                background = {
                    drawing = false
                },
                label = {
                    padding_left = settings.group_paddings,
                    padding_right = settings.group_paddings,
                    color = i == 1 and colors.orange or colors.primary,
                },
                click_script = "$CONFIG_DIR/helpers/menus/bin/menus -s " .. i
            }
        )

    menu_items[i] = menu
end

local menu_bracket = sbar.add(
    "bracket",
    { "/menu\\..*/" },
    {
        alpha = 0,
        background = {
            corner_radius = 6,
            height = 28,
            color = colors.bar.bg,
        }
    }
)



local function update_menus(env)
    sbar.exec("$CONFIG_DIR/helpers/menus/bin/menus -l", function(menus)
        sbar.set('/menu\\..*/', { drawing = false })
        id = 1
        for menu in string.gmatch(menus, '[^\r\n]+') do
            if id < max_items then
                menu_items[id]:set({ label = menu, drawing = true })
            else
                break
            end
            id = id + 1
        end
    end)
end

menu_watcher:subscribe("front_app_switched", update_menus)

space_menu_swap:subscribe("swap_menus_and_spaces", function(env)
    sbar.animate("elastic", 15, function()
        sbar.delay(0.3, function()
            local drawing = menu_items[1]:query().geometry.drawing == "on"
            if drawing then
                menu_watcher:set({ updates = false, label = { size = 0, } })
                sbar.set("/menu\\..*/", { alpha = 1, drawing = false })
                sbar.set("front_app", { drawing = true })
            else
                menu_watcher:set({ updates = true })
                sbar.set("front_app", { drawing = true })
                update_menus()
            end
        end)
    end)
end)
return menu_bracket
