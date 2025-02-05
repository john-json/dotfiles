# Release Notes
All notable changes to this project and release history of the "GitHub Codespaces" extension will be documented in this file.

# 1.17.3
* Introduces a new `github.codespaces.supportProxies` setting to allow proxies to make `CONNECT` requests when connecting to codespaces.
* Bug fixes

# 1.17.2
* Bug fixes

# 1.17.1
* Removes the deprecated port forwarding service that would forward ports over `<name>-<port>.preview.app.github.dev` and now only forwards ports with the new service over `<name>-<port>.app.github.dev`.
* Fixes a bug that caused local port forwarding connections to not properly close when the `Content-Length` header was not present.
* Bug fixes

# 1.16.23
* Combines the `Rebuild Container` commands into a single command. The different flavors of rebuilding can be selected in the modal which appears when running the command.
* Bug fixes

# 1.16.22
* Bug fixes

# 1.16.21
* Bug fixes

# 1.16.20
* Bug fixes

# 1.16.19
* Bug fixes

# 1.16.18
* Bug fixes

# 1.16.17
* Bug fixes

# 1.16.16
* Bug fixes

# 1.16.15
* Bug fixes

# 1.16.14
* Bug fixes

# 1.16.13
* Bug fixes

# 1.16.12
* Relevant dev container Features and templates are suggested in the `Add Dev Configuration Files...` UX (Requires Copilot Chat 0.13.0+ co-installed)
* Improvements to logging
* Updates minimum required version of VS Code version to 1.85.0 or higher
* Bug fixes

# 1.16.11
* Bug fixes

# 1.16.10
* Bug fixes

# 1.16.9
* Bug fixes

# 1.16.8
* Bug fixes

# 1.16.7
* Bug fixes

# 1.16.6
* Bug fixes

# 1.16.5
* Add support for the `remote.localPortHost` VS Code setting. Using the `localhost` option (default) will forward ports locally over `127.0.0.1` and the `allInterfaces` option will forward over `0.0.0.0` to open the port to other machines on your network.
* Bug fixes

# 1.16.4
* Bug fixes

# 1.16.3
* Bug fixes

# 1.16.2
* Bug fixes

# 1.16.1
* Bug fixes

# 1.16.0
* Improve the experience of accepting devcontainer permissions during codespace creation by waiting for the permission acceptance flow in the browser to complete before automatically continuing with codespace creation
* Launch `postAttachCommand` terminals from the devcontainer's `workspaceFolder` instead of the current working directory in VS Code
* Bug fixes

# 1.15.4
* Bug fixes

# 1.15.3
* Bug fixes

# 1.15.2
* Bug fixes

# 1.15.1
* Bug fixes

# 1.15.0
* Add the codespace display name to the remote indicator and title bar to make it easier to distinguish between multiple VS Code windows connected to different codespaces. A new setting `github.codespaces.showDisplayNameInRemoteIndicator` can be used to disable this feature.
* Bug fixes

# 1.14.16
* Remove the `github.codespaces.connectionType` setting as all connections are now created on the main thread.
* Bug fixes

# 1.14.15
* Bug fixes

# 1.14.14
* Bug fixes

# 1.14.13
* Bug fixes

# 1.14.12
* Bug fixes

# 1.14.11
* Bug fixes

# 1.14.10
* Bug fixes

# 1.14.9
* Remove the `Delete Codespace...` command from the remote indicator when disconnected from a codespace
* Bug fixes

# 1.14.8
* Bug fixes

# 1.14.7
* Bug fixes

# 1.14.6
* Bug fixes

# 1.14.5
* Bug fixes

# 1.14.4
* Bug fixes

# 1.14.3
* Bug fixes

# 1.14.2
* Bug fixes

# 1.14.1
* Bug fixes

# 1.14.0
* Update extension activation conditions to remove `*` activation. This causes some commands to change when they appear in the command palette. Instead of only showing commands when signed in, Codespaces commands will now always be visible and will instead prompt for sign-in when needed.
* Improve the dev container prompt during codespace creation
* Add `devcontainer-feature.json` schema validation when editing a [Dev Container Feature](https://containers.dev/implementors/features/)  metadata file.
* Bug fixes

# 1.13.10
* Update the `Connect to Codespace...` command to respect the `github.codespaces.createCodespaceInNewWindow` and `window.openFoldersInNewWindow` VS Code settings. If either setting is enabled, codespaces will be opened in a separate window.
* Bug fixes

# 1.13.9
* Bug fixes

# 1.13.8
* Change command 'Configure Dev Container...' display text back to 'Add Dev Container Configuration Files...'
* Bug fixes

# 1.13.7
* Bug fixes

# 1.13.6
* Bug fixes

# 1.13.5
* Bug fixes

# 1.13.4
* Bug fixes

# 1.13.3
* Bug fixes

# 1.13.2
* Remove "Recent Files/Folders" entries for deleted codespaces in the desktop client
* Bug fixes

# 1.13.1
* Bug fixes

# 1.13.0
* Update the `Add Dev Container Configuration Files...` command to pull from the Dev Container Index (https://containers.dev/templates and https://containers.dev/features)
* Bug fixes

# 1.12.1
* Bug fixes

# 1.12.0
* Modified `Rebuild Container` command to perform an incremental rebuild without cleaning the docker cache.
* Added a `Full Rebuild Container` command to clear the docker cache before doing the rebuild.
* Bug fixes

# 1.11.1
* Bug fixes

# 1.11.0
* Bump minimum VS Code version to 1.71 and add tunnels proposal
* Improve error message for recovery mode
* Update the `Configure Dev Container Features...` command to pull from the Dev Container Index (https://containers.dev/features)
* Bug fixes

# 1.10.7
* Bug fixes

# 1.10.6
* Bug fixes

# 1.10.5
* Bug fixes

# 1.10.4
* Bug fixes

# 1.10.3
* Bug fixes

# 1.10.2
* Bug fixes

# 1.10.1
* Bug fixes

# 1.10.0
* Bump minimum VS Code version to 1.68
* Bug fixes

# 1.9.4
* Bug fixes

# 1.9.3
* Bug fixes

# 1.9.2
* Bug fixes

# 1.9.1
* Bug fixes

# 1.9.0
* Manage user secrets from web client
* Bug fixes

# 1.8.3
* Bug fixes

# 1.8.2
* Bug fixes

# 1.8.1
* Bug fixes

# 1.8.0
* Manage user secrets
* Bug fixes

# 1.7.1
* Bug fixes
* Inform users if their idle timeout changes due to an organizational policy

# 1.7.0
* Add support for detecting deprecated/unsupported extension versions
* Add support for choosing between multiple devcontainer.json files when creating a codespace
* Bug fixes

# 1.6.0
* Use new 'codespace' oauth scope
* Add support for updating secrets on running codespaces
* Bug fixes

# 1.5.9
* Bug fixes

# 1.5.8
* Add support for pending async operations allowing users to see when a codespace is unavailable such as when changing machine types
* Bug fixes

# 1.5.7
* Refresh codespace list in the Remote Explorer when the Remote Explorer view is opened
* Bug fixes

# 1.5.6
* Bug fixes

# 1.5.5
* Bug fixes

# 1.5.4
* Bug fixes

# 1.5.3
* Bug fixes

# 1.5.2
* Bug fixes

# 1.5.1
* Adding support for private desktop port forwarding via basis (controlled by exp feature flag)
* Automatically synchronize `telemetry.telemetryLevel` setting across codespace web clients
* Bug fixes

# 1.5.0
* Add support for showing codespace idle timeout and friendly names in the UI
* Minimum VS Code version required is 1.63+
* Bug fixes

# 1.4.4
* Port-forwarding UI improvements.
* Bug fixes.

# 1.4.3
* Prompt user to change machine type or export changes when blocked from connecting due to organization machine type policy
* Support for admin-set port privacy settings
* Port-forwarding and other bug fixes

# 1.4.2
* Improve port forwarding reconnection logic
* Performance improvements for listing codespaces
* Bug fixes

# 1.4.1
* Bug fixes

# 1.4.0
* Switch to new [Codespaces REST APIs](https://docs.github.com/en/rest/reference/codespaces)
* Support listing >30 codespaces
* Enable Settings Sync for remote extensions when connecting to a codespace from VS Code desktop (Requires VS Code 1.63 or higher)
* Update machine types quick pick to display if prebuild ready during codespace creation
* Performance improvements
* Bug fixes

# 1.3.6
* Bug fixes

# 1.3.5
* Bug fixes

# 1.3.4
* Bug fixes

# 1.3.3
* Bug fixes

# 1.3.2
* Bug fixes

# 1.3.1
* Bug fixes

# 1.3.0
* Adding support to share ports within an organization.
* Bug fixes

# 1.2.3
* Bug fixes

# 1.2.2
* Bug fixes

# 1.2.1
* Bug fixes

# 1.2.0
* Added setting `github.codespaces.devcontainerChangedNotificationStyle` to allow users to customize what notification they will receive on dev container change. Default is `notification`.
* Bug fixes

# 1.1.0
* Added interactive notifications to let users know their codespace is about to stop.
* `Connect to Codespace` command now handles codespaces in more states.
* Remove `web` extension kind since VS Code infers it automatically now
* Bug fixes

# 1.0.7
* Bug fixes

# 1.0.6
* Set environment variable `CODESPACE_VSCODE_FOLDER` or `CODESPACE_VSCODE_WORKSPACE` when connected to a codespace to point to the file path of the currently opened folder or workspace.
* Bug fixes

# 1.0.5
* Signing out of GitHub in VS Code while connected to a codespace will now disconnect from the codespace.
* Bug fixes

# 1.0.4
* Devcontainer changes to prebuild environments now recommend recreating the codespace.
* Remove git status monitoring for connected codespaces since that now happens within the service.
* Bug fixes

# 1.0.3
* Bug fixes

# 1.0.2
* Bug fixes

# 1.0.1
* Enable support for port protocol menu
* Bug fixes

# 1.0.0
* GA release! 🚀

# 0.11.3
* Bug fixes

# 0.11.2
* Bug fixes

# 0.11.1
* Increase performance notification interval to 2 minutes
* Bug fixes

# 0.11.0
* Bump minimum VS Code version to 1.56 to adopt `statusBar/remoteIndicator` contributions
* Improve interactions between Codespaces and Remote Repositories when both extensions are installed
* Bug fixes

# 0.10.10
* Displaying client cpu usage on performance explorer and enabling local performance notifications
* Re-enabling performance notifications for user and displaying cpu usage from performance explorer
* Remove dependency on deprecated `vscode.authentication.providers` API
* Bug fixes

# 0.10.9
* Improve instance type selection during codespace creation
* Bug fixes

# 0.10.8
* Disabling performance notifications for user and removing cpu usage from performance explorer
* Bug fixes

# 0.10.7
* Add visual warning for user when a codespace has high cpu and/or memory usage
* Add support for creating a codespace from a RemoteHub virtual workspace
* Bug fixes

# 0.10.6
* Added storage and memory metrics to the performance explorer
* Bug fixes

# 0.10.5
* Update protocol handler to support connecting by name
* Bug fixes
* Added a compute monitor that updates the performance explorer with cpu usage data if the explorer is visible to the user

# 0.10.4
* Bug fixes

# 0.10.3
* Change wording from suspend/resume to stop/start.
* Improved the way we notify the user of the post-create process by showing it in a terminal with a cleaner format
* Bug fixes

# 0.10.2
* Bug fixes

# 0.10.1
* Added a monitor to inform users when their Codespace is running low on available disk space
* Bug fixes

# 0.10.0
* New command `Export Changes to a Branch` allows exporting unpushed changes to a branch
* Progress feedback for automatic container upgrade during resume
* Added confirmation dialog to rebuild command
* Bug fixes

# 0.9.4
* Add back port forwarding restore logic
* Bug fixes

# 0.9.3
* Change connect behavior to open in a new window if the current VS Code window has a folder or workspace open
* Updated design for the codespace quick pick list when running certain commands
* Remove port forwarding restore logic
* Bug fixes

# 0.9.2
* Enable forking a codespace's repository to allow codespaces to be created on repositories that users do not have write access to
* Warn users when their Codespace container is too old and needs to be upgraded
* Bug fixes

# 0.9.1
* Prompts to rebuild the container when devcontainer configurations are modified.
* Bug fixes

# 0.9.0
* Use the `Make public` context menu command on a forwarded port to make it public. These urls do not need authentication when shared with others for testing.
* Update port forwarding urls for HTTPS and Public Ports to be `<codespace name>-<port>.githubpreview.dev`
* Bug fixes

# 0.8.5
* Don't display a message if user enters the current machine type when running the `Change Machine Type` command.
* Bug fixes

# 0.8.4
* Improved creation experience by reloading VS Code into the codespace as soon as possible.
* Bug fixes

# 0.8.3
* Opening a codespace in VS Code from the protocol handler will now reuse an open VS Code window instead of always opening a new window
* Running the `Open in Browser` command when connected to a codespace now opens the connected codespace in the browser instead of listing all of your codespaces. Running the command when not connected to a codespace will prompt you to select one from your list of codespaces.
* New command `Change Machine Type` allows a codespace to be changed to a different machine type.
* Bug fixes

# 0.8.2
* Bug fixes

# 0.8.1
* Improve dialogs for connecting to a codespace while not signed into the extension or a codespace that has been deleted
* Automatically save unsaved files when triggering container rebuild
* Connection performance improvements
* Bug fixes

# 0.8.0
* Improve the Codespaces list in the remote explorer by grouping codespaces by repo owners. Personal repos will always display first and within owner groups, Codespaces will be sorted based on the last time they were used.
* Simplify the commands and remote explorer views when connected to a codespace
* Move connection out-of-process to provide faster reload/reconnect to running codespaces
* Update feedback links to point to [Codespaces feedback discussions](https://github.com/github/feedback/discussions/categories/codespaces-feedback)
* Bug fixes

# 0.7.2
* Status bar showing the codespace configuration with the ability to click on it to open the terminal
* Support for Oryx build cancellation through the status bar or ctrl + c command in the terminal
* Bug fixes

# 0.7.1
* Fix connection to VS Code workspace files

# 0.7.0
* Add `Rebuild Container` command to rebuild the codespace container at any time, which allows changing devcontainer.json configuration and iterating on the container setup scripts
* Bug fixes

# 0.6.1
* Improve `Export Logs` command to pick better default paths
* Added session latency information to Performance Explorer
* Support for Oryx build cancellation when executing ctrl+c command from the terminal
* Improve the experience when resuming a codespace from VS Code desktop
* Added session ID to Performance Explorer
* Bug fixes

# 0.6.0
* Improve disconnection dialogs when a codespace suspends while connected on VS Code desktop (requires VS Code 1.53)
* Prevent executing Codespaces commands for users who are not in the beta
* Bug fixes

# 0.5.2
* Improve the sign in flow when switching from web to desktop VS Code and desktop is not already signed in
* New format for the creation log data.
* Bug fixes

# 0.5.1
* Added session bytes in/out data to the Performance Explorer
* Better error message if you try to create a codespace and are already at the codespace limit
* Bug fixes

# 0.5.0
* Connections to existing codespaces now automatically connect back to the last folder or VS Code workspace that you last opened instead of always connecting to the repo root. This makes it easier for you to pick up where you left off when returning back to a codespace.
* Added a setting, `github.codespaces.createCodespaceInNewWindow`, to control whether a new codespace will be opened in a new window after it is created. `false` by default.
* Added session disconnection info to Performance Explorer.
* Made codespace ID easily copyable in Performance Explorer.
* Changed creation log experience to use the VS Code terminal.
* Bug fixes

# 0.4.0
* HTTPS services will be forwarded through the port forwarding service by default. You can toggle this setting via `github.codespaces.usePortForwardingServiceForHTTPS` or through the Settings UI.
* Recently opened VS Code workspaces now show up in the remote explorer for easy reconnection
* Bug fixes

# 0.3.2
* Fix "Open in Browser" to show up for more codespaces in the remote explorer
* Bug fixes

# 0.3.1
* Bug fix for sign in interface.

# 0.3.0
* Added new toggleable Performance Explorer tree view. You can toggle this via the `github.codespaces.showPerformanceExplorer` setting or via the `Toggle Codespace Performance Explorer` command in the command palette.
* Various bug fixes, including a fix for an issue that could cause VS Code to fail to fully load a codespace or to reconnect while loading

# 0.2.0
* Improved creation log experience
* Improved welcome view
* Bug fixes

# 0.1.0
* GitHub Codespaces extension initial release
