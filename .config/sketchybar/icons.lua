local settings = require("settings")

local icons = {
    sf_symbols = {
        arrow_up = "􀆇",
        arrow_down = "􀆈",
        arrow_left = "􀁙",
        arrow_right = "􀆊",
        plus = "􀐇",
        loading = "􀖇",
        apple = "􀣺",
        line = "􀝷",
        gear = "􀍟",
        cpu = "􀧓",
        clipboard = "􀉄",
        aqi = "􀴿",
        clock = "􀐫",
        menu_bar2 = "􀾚",
        menu_bar = "􀾩",
        spaces = "􁏮",
        menu = "􀬑",
        space_add = "􀁍",
        settings = "􀍠",
        cpu2 = "􀎴",
        circle_options = "􀆕",
        play = "􀊈",
        swap2 = "􁌧",
        start = "􀬑",
        start_on = "􁌧",
        circle_lines = "􀧲",
        circle_restart = "􀖋",
        circle_shutdown = "􁾯",
        circle_sleep = "􀆼",
        circle_power = "􀷄",
        circle_gear = "􀺻",
        circle_quit = "􀁡",
        circle_picker = "􁾛",
        circle_cal = "􀐫",
        circle_plus = "􀁍",
        circle_menu = "􀧲",
        search = "􀊫",
        mission_control = "􁥊",
        smenu = "􀬑",
        swap = "􀺊",
        user = "􀓤",

        weather = {
            sun = "􀆬",
            cloudy = "􀇣",
            cloud_sun = "􀇕",
            rain = "􁷍",
            snowflake = "􀇏",
            bolt = "􀇟",
            fog = "􀇋",
            mist = "􁃛",
            cloud_rain = "􀇇",
        },

        switch = {
            on = "󰔡",
            off = "󰨙"
        },
        volume = {
            _100 = "􀊩",
            _66 = "􀊧",
            _33 = "􀊧",
            _10 = "􀊥",
            _0 = "􀊣"
        },
        battery = {
            _100 = "",
            _75 = "􀺸",
            _50 = "􀺶",
            _25 = "􀻂",
            _0 = "􀛪",
            charging = "􀢋"
        },
        wifi = {
            upload = "􀁯",
            download = "􀁱",
            connected = "󰖩",
            disconnected = "󰖪",
            router = "􁓣"
        },
        media = {
            icon = "󰝚",
            back = "􀊉",
            forward = "􀊋",
            play_pause = "􀊇",
        }
    },
    -- Alternative NerdFont icons
    nerdfont = {
        plus = "",
        loading = "",
        apple = "",
        gear = "",
        cpu = "",
        clipboard = "Missing Icon",
        switch = {
            on = "􁏮",
            off = "􁏯"
        },
        volume = {
            _100 = "􀊩",
            _66 = "􀊩",
            _33 = "􀊧",
            _10 = "􀊥",
            _0 = "􀊣"
        },
        battery = {
            _100 = "",
            _75 = "",
            _50 = "",
            _25 = "",
            _0 = "",
            charging = ""
        },
        wifi = {
            upload = "􀄤",
            download = "􀓃",
            connected = "􀙇",
            disconnected = "􀙈",
            router = "􁓤"
        },
        media = {
            back = "􀊊",
            forward = "􀊌",
            play_pause = "􀊄"
        }
    },
    -- Animated icons
    animated = {
        loading = "􀖇", -- Example animated icon
        arrow_down = "􀆈",
        arrow_left = "􀁙",
        arrow_right = "􀆊",
        arrow_up = "􀆇",
        -- Add more animated icons as needed
    }
}



local function select_icons()
    if settings.icons == "NerdFont" then
        return icons.nerdfont
    elseif settings.icons == "Animated" then
        return icons.animated
    else
        return icons.sf_symbols
    end
end

return select_icons()
