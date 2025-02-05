# Fira Code Nerd Font and icons

Sets a minimal icon theme using Material icons from [Nerd Fonts](https://www.nerdfonts.com/).

More importantly, makes [Fira Code](https://github.com/tonsky/FiraCode) Nerd Font available to VS Code where fonts can't be installed locally, such as using VS Code in the browser.

## To use

After installing the extension, add the following lines to your `settings.json` file

``` json
"workbench.iconTheme": "fira-code-material-minimal",
"editor.fontFamily": "fira-code-nerd, FiraCode Nerd Font, Consolas, 'Courier New', monospace",
"editor.fontLigatures": true
```

Alternatively:

1) Open user settings.
2) Under *Workbench* > *Appearance*, set *Workbench:Icon Theme* to *Fira Code Material Minimum Icons*.
3) Under *Text Editor* > *Font*, set *Editor:Font Family* to *fira-code-nerd* followed by any fallback fonts you wish to add. 
4) Optionally under *Terminal*, set *Termninal - Integrated:Font Family* to *fira-code-nerd*, or leave it blank to default to the editor font above.  This is especially useful if you are using Oh My Posh or similar, as the Nerd Fonts also include powerline symbols.

*You must enable the icon pack* if you wish the font to be available to the editor, unless you have the font installed locally.  Additional icons may be added in future if there is interest.
