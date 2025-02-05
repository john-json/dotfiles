return {
    dimm_yellow = 0xffcbcca4,
    dimm_green = 0xff476b5c,
    dimm_red = 0xffef838c,
    dimm_blue = 0xff00617d,
    dimm_darkblue = 0xff6275a1,
    dimm_purple = 0xff835c7a,
    dimm_monotone = "0xff7bb9bf",
    dimm_pewter = 0xffd4a254,
    dimm_pewter_sec = 0xff41605a,
    dimm_glow = 0xffbbbbbb,
    dimm_glow2 = 0xffd4a254,

    hover = 0xff675147,
    black = 0xff000000,
    chgreen = 0xff282929,
    white = 0xffb4b4b4,
    foreground = 0xffeaddd4,
    foreground_hover = 0xffdcdedf,
    foreground_light = 0xffa0a0a0,
    foreground_dark = 0xff1c1c1c,
    inactive_foreground = 0xff5c5c5c,
    icon_active = 0xff939393,
    spice = 0xff925449,
    spicee = 0xff8e5246,
    gold = 0xff3c3525,
    red_light = 0xffa9645d,
    red = 0xffe94639,
    redwood = 0xffa25a54,
    red_dark = 0xff573738,
    green = 0xff6b7c6b,
    yellow = 0xffc9b188,
    golden = 0xffc5bc6a,
    orange = 0xffd09367,
    blue = 0xff4a5b6b,
    grey_blue = 0xff6f797c,
    light_blue = 0xff657378,
    darkblue = 0xff212c35,
    pink = 0xff725955,
    magenta = 0xff595066,
    magenta_dark = 0xff3a3949,
    magenta_darker = 0xff25232f,
    nickel = 0xff6b7c6b,
    nickelblu = 0xff657378,
    auro = 0xff6f797c,
    puce = 0xffa9645d,
    pastel = 0xffcfcdca,


    lightgrey = 0xff666666,
    dolphin_grey = 0xff7a8e82,

    desert_sand = 0xffdfc9a7,
    cadet = 0xff5c716c,
    quartz = 0xff4c4a50,
    eggplant = 0xff5b4550,
    deeptaupe = 0xff806666,



    transparent = 0x00000000,
    semi_transparent = 0x40ffffff,
    border_transparent = 0x33ffffff,

    grey2 = 0xff626262,
    grey3 = 0xff4e4e4e,
    grey4 = 0xff373737,
    grey5 = 0xff303030,

    icon = {
        grey = "0xff8e8e8e",
    },
    bar = {
        bg = 0xffffffff,
        bg2 = 0xffffffff,
        accent = 0xff000000,
        active = 0xff9eaeb3,
        selected = 0xff593c3c,
        transparent = 0xe51e1e1e,
        border = 0x1affffff,
        secondary = 0xffd6d6d6,
        white_transparent = 0x0dffffff,
        inactive = 0xfff2f2f2,
        icons = 0xff61817f,
        foreground = 0xff857261,
        foreground_hover = 0xff828282,
        foreground_icon = 0xff486a68,
        foreground_dimmed = 0x66dcdcdc,
        foreground_alt_blue = 0xff497270,
        foreground_alt_blue_dimmed = 0xff3d6765,
    },
    media = {
        primary = 0xff1c1c1c,
        secondary = 0xffffffff,
    },
    popup = {
        bg = 0xB3ffffff,
        bg_alt = 0x99ba7666,
        border = 0xffffffff,
        hover = 0xff757575,
        icons = 0xffe3e3e3,

        bg1 = 0xff1c1c1c,
        bg2 = 0xff242424,
        with_alpha = function(color, alpha)
            if alpha > 1.0 or alpha < 0.0 then
                return color
            end
            return (color and 0x001e1e1e) or (math.floor(alpha * 255.0) < 24)
        end
    }
}
