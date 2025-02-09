return
{
    "tinted-theming/tinted-vim",
    config = function()
        vim.cmd.colorscheme 'base16-material-darker'
        vim.g.tinted_background_transparent = 1
    end,
}
