return {
    -- add pyright to lspconfig
    {
        "neovim/nvim-lspconfig",

        opts = {

            servers = {
                -- pyright will be automatically installed with mason and loaded with lspconfig
                pyright = {},
            },
        },
    },

    -- add tsserver and setup with typescript.nvim instead of lspconfig

}
