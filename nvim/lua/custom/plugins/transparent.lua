return {
    -- add pyright to lspconfig
    {
        "xiyaowong/transparent.nvim",
        ---@class PluginLspOpts
        opts = {
            extra_groups = {
                "NormalFloat",   -- plugins which have float panel such as Lazy, Mason, LspInfo
                "NvimTreeNormal" -- NvimTree
            },
        },
    },

    -- add tsserver and setup with typescript.nvim instead of lspconfig

}
