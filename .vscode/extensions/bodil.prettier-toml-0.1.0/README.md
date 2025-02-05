# vscode-prettier-toml

VS Code formatter for TOML using the [Prettier](https://prettier.io/)
[TOML plugin](https://www.npmjs.com/package/prettier-plugin-toml).

## About

While you can configure the standard [Prettier plugin](https://github.com/prettier/prettier-vscode)
to handle TOML in your project local Prettier config, there are situations where you don't want a
project local Prettier config but still have TOML files that need formatting (such as every Rust
project ever). This plugin provides for that scenario until such time as the standard Prettier
plugin lets you configure globally which extensions it can handle through plugins.

## Licence

Copyright 2020 Bodil Stokke

This program is free software: you can redistribute it and/or modify it under the terms of the GNU
Lesser General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with this program. If
not, see https://www.gnu.org/licenses/.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct][coc]. By
participating in this project you agree to abide by its terms.

[coc]: https://github.com/bodil/vscode-prettier-toml/blob/master/CODE_OF_CONDUCT.md
