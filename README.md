# My dotfiles for various apps

[Report a Bug]([[https://github.com/)
·
[Ask a Question]([https://github.com/)

[![license: MIT](https://img.shields.io/badge/license-MIT-yellow.svg?style=for-the-badge)](https://github.com/)

### [🤔 Why?](https://www.youtube.com/watch?v=zTDeEJyCmNA&t=39s)

Initially, it was an automatic (CronJob) playlist archiving tool for "New Music Friday" playlists from popular EDM labels.
It allowed me to compensate for FOMO when I didn't have time to discover new music right away.

Over time, I developed the desire to rewrite the otherwise lifelong beta (~~never touch a running system~~)
and sprinkle some structured overhead on top ;-)

## 📖 Table of Contents

<details>
<summary>Click to expand</summary>

- [📖 Table of Contents](#-table-of-contents)
- [⛓ Features](#-features)
- [🚀 Getting Started](#-getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
    - [Download or Clone the Project](#download-or-clone-the-project)
    - [Install Dependencies via Composer](#install-dependencies-via-composer)
  - [Config](#config)
    - [.env](#env)
    - [Connecting to Spotify's Web API](#connecting-to-spotifys-web-api)
  - [Usage](#usage)
    - [Playlist Archiving](#playlist-archiving)
    - [List Archived Playlists](#list-archived-playlists)
    - [Delete Archived Playlists](#delete-archived-playlists)
    - [Create Artist Catalog Playlist](#create-artist-catalog-playlist)
    - [Search Library Playlists for a Given Track](#search-library-playlists-for-a-given-track)
- [🔨 Development](#-development)
  - [Tech Stack](#tech-stack)
- [☑️ TODOs](#%EF%B8%8F-todos)
- [✨ Future Features](#-future-features)
- [Changelog](#changelog)
- [Help & Questions](#help--questions)
- [Contributing](#contributing)
- [👤 Author](#-author)
- [🤝 Credits](#-credits)
- [💛 Support](#-support)
- [⚖️ Disclaimer](#%EF%B8%8F-disclaimer)
- [📃 License](#-license)
</details>

## ⛓ Features

- Archive playlists from CSV or argument input with special naming syntax and mailing.
- Search library playlists for a given track.
- Create playlists with complete artist catalogs.
- see: [✨ Future Features](#-future-features).

## 🚀 Getting Started

### Requirements

- php >= 8.2
- Composer

### Installation

#### Download or Clone the Project

```shell
composer create-project stevenfoncken/multitool-for-spotify-php
```

or

```shell
git clone --depth 1 https://github.com/stevenfoncken/multitool-for-spotify-php.git
```

Now `cd` into the project directory.

---

#### Install Dependencies via Composer

Skip when create-project was used.

```shell
composer install
```

---

### Config

#### .env

```shell
cp config/.env.dist config/.env
```

Set your timezone in `APP_TIMEZONE` - [List of Supported Timezones](https://www.php.net/manual/en/timezones.php).

---

#### Connecting to Spotify's Web API

`multitool-for-spotify-php` needs to connect to Spotify's Web API in order to function.

1. Log in to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click [Create app](https://developer.spotify.com/dashboard/create).
   - Choose name, description, website
   - Redirect URI: `http://localhost:10276/mtfsp-auth-callback`
   - Check `Web API`
3. Click `Save`
4. Click `Settings`
5. Copy `Client ID` to [.env](config/.env) `SPOTIFY_API_CLIENT_ID`
6. Copy `Client Secret` to [.env](config/.env) `SPOTIFY_API_CLIENT_SECRET`

It should look like this (but with your own values):

```
SPOTIFY_API_CLIENT_ID="2c914ba76f18385qu4b57qr82o5p1e64"
SPOTIFY_API_CLIENT_SECRET="15g2fh52qg1631j1hex4sg167164c1a6"
```

7. Open your terminal.
8. Run: `php bin/console mtfsp:auth`
9. Follow the displayed instructions.

Now you are ready to use `multitool-for-spotify-php` 🎉

---

### Usage

#### Playlist Archiving

```shell
php bin/console mtfsp:archive [--mail] <playlistIDsOrCSV>
```

Each playlist has a snapshot ID that is written to the description of the archived playlist to check whether the playlist has already been archived.

A new archive playlist is only created if the content (so the snapshot ID) has been changed.

Example of the name of an generated archive playlist: SFY-2024-06-Top 50 Global
(PREFIX-YYYY-WW-SUFFIX or PLAYLIST_NAME)

You can choose between single playlist IDs or a path to a CSV file as an argument:

**Argument playlist ID:**

Single or comma-separated spotify playlist ID(s).

**Argument CSV file path:**

| CSV header           | Description                                                                                                     | Required |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| Playlist_Name_Prefix | Custom abbreviation e.g. SFY for spotify playlists. Uses ARCHIVE when not set.                                  | No       |
| Playlist_Name_Suffix | Custom playlist name. Uses the playlist name when not set.                                                      | No       |
| Playlist_Sort_Order  | desc => recent added tracks at top, asc => oldest added tracks at top. Uses playlist default oder when not set. | No       |
| Playlist_Id          | The ID of the spotify playlist.                                                                                 | Yes      |
| Tags                 | For personal use.                                                                                               | No       |

The CSV must be separated by semicolons. Example: [playlists-to-archive.dist.csv](config/playlists-to-archive.dist.csv)

**Option for mailing:**

If you set the mail env vars in your [.env](config/.env) file,
you can use `--mail` to receive notifications when the archiving process is complete.

This is particularly useful when using a CronJob.

---

#### List Archived Playlists

```shell
php bin/console mtfsp:archive:list-playlists
```

---

#### Delete Archived Playlists

```shell
php bin/console mtfsp:archive:delete-playlists
```

Currently all archived playlists will be deleted.
But multiple "are you sure" checks will protect you from hasty mistakes ;-)

---

#### Create Artist Catalog Playlist

```shell
php bin/console mtfsp:artist:catalog-to-playlist <artistId> [<playlistId>]
```

If you specify a playlist ID, the catalog will be added to this playlist, otherwise a new playlist will be created.

---

#### Search Library Playlists for a Given Track

```shell
php bin/console mtfsp:search:track-in-library [--withArchived] <trackIdNeedle>
```

Set `--withArchived` if you want to include archived playlists in the search.

## 🔨 Development

### Tech Stack

The project is built using the [Symfony Console](https://github.com/symfony/console) component.

## ☑️ TODOs

- [ ] Add unit tests

## ✨ Future Features

- Archiving: retrieve source playlists from dedicated Spotify playlist folder.
- MyWeeklySelection: command that creates a public profile playlist with the last 30 liked songs with custom playlist image.
- Archiving: add Spotify agnostic storage, see [feature/add-database](https://github.com/stevenfoncken/multitool-for-spotify-php/tree/feature/add-database).
- Everything that comes to my mind while I'm showering ;-)

## Changelog

Please see [CHANGELOG.md](./CHANGELOG.md) for more information on what has changed recently.

## Help & Questions

Start a new discussion in the [Discussions Tab](https://github.com/stevenfoncken/multitool-for-spotify-php/discussions).

## Contributing

... is welcome.

Just [fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and [create a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

For major changes, please first start a discussion in the [Discussions Tab](https://github.com/stevenfoncken/multitool-for-spotify-php/discussions) to discuss what you would like to change.

**IMPORTANT:** By submitting a patch, you agree to allow the project owner(s) to license your work under the terms of the [`MIT License`](./LICENSE).

**Thank you!**

## 🤝 Credits

Like most software, `multitool-for-spotify-php` is build upon third-party code/libraries which was/were written by others.

I would therefore like to thank the people below for open-sourcing their work:

> Project: [jwilsson/spotify-web-api-php](https://github.com/jwilsson/spotify-web-api-php)
>
> Author: [@jwilsson (Jonathan Wilsson)](https://github.com/jwilsson)
>
> Copyright (c) Jonathan Wilsson
>
> License: [MIT](https://github.com/jwilsson/spotify-web-api-php/blob/main/LICENSE.md)

> Project: [symfony/console](https://github.com/symfony/console)
>
> Author: [@fabpot (Fabien Potencier)](https://github.com/fabpot)
>
> Copyright (c) 2004-present Fabien Potencier
>
> License: [MIT](https://github.com/symfony/console/blob/6.3/LICENSE)

... and more, see [composer.json](./composer.json).

## 💛 Support

If this project was helpful for you or your organization, please consider supporting my work directly:

- ⭐️ [Star this project on GitHub](https://github.com/john-json/dotfiles)
- 🐙 [Follow me on GitHub](https://github.com/john-json)

Everything helps, thanks! 🙏

## ⚖️ Disclaimer

"Spotify" is a registered trademark of "Spotify AB" and/or its (worldwide) subsidiaries.

This project or its author is in **no way** officially connected to, affiliated with, associated with, authorized by, built by, endorsed by, licensed by, maintained by, promoted by, or sponsored by "Spotify AB" or any of its affiliates, licensors, (worldwide) subsidiaries, or other entities under its control.

All trademarks are the property of their respective owners.

This is an independent project that utilizes "Spotify"s Web API to perform various tasks in the personal account.

Before taking legal action, please contact this address: dev[at]stevenfoncken[dot]de

Use at your own risk.

## 📃 License

[multitool-for-spotify-php](https://github.com/stevenfoncken/multitool-for-spotify-php) is licensed under the `MIT License`.

See [LICENSE](./LICENSE) for details.

Copyright (c) 2020-present [Steven Foncken](https://github.com/stevenfoncken) \<dev[at]stevenfoncken[dot]de\>

<p align="right">^ <a href="#multi-tool-for-spotify">back to top</a> ^</p>
