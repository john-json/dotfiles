const vscode = require("vscode");
const process = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {
    activate,
    deactivate,
};

let myContext;

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function Activate ●                             │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function activate(context) {

    // • Activate - Initialize Extension • 
    //---------------------------------------------------------------------------------------------------------
    myContext = context;                    // Save context

    // • Activate - Register Extension Commands • 
    vscode.commands.registerCommand('rc-script.run.editor', runEditor);
    vscode.commands.registerCommand('rc-script.set.editor', setEditor);

    // • Activate - Push Subscriptions • 
    context.subscriptions.push(runEditor);
    context.subscriptions.push(setEditor);

    // • Activate - Register Completion Provider - Virtual Keys • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['VK_LBUTTON', 'VK_RBUTTON', 'VK_CANCEL', 'VK_MBUTTON', 'VK_XBUTTON1', 'VK_XBUTTON2', 'VK_BACK', 'VK_TAB', 'VK_CLEAR', 'VK_RETURN', 'VK_SHIFT', 'VK_CONTROL', 'VK_MENU', 'VK_PAUSE', 'VK_CAPITAL', 'VK_KANA', 'VK_HANGUEL', 'VK_HANGUL', 'VK_IME_ON', 'VK_JUNJA', 'VK_FINAL', 'VK_HANJA', 'VK_KANJI', 'VK_IME_OFF', 'VK_ESCAPE', 'VK_CONVERT', 'VK_NONCONVERT', 'VK_ACCEPT', 'VK_MODECHANGE', 'VK_SPACE', 'VK_PRIOR', 'VK_NEXT', 'VK_END', 'VK_HOME', 'VK_LEFT', 'VK_UP', 'VK_RIGHT', 'VK_DOWN', 'VK_SELECT', 'VK_PRINT', 'VK_EXECUTE', 'VK_SNAPSHOT', 'VK_INSERT', 'VK_DELETE', 'VK_HELP', 'VK_LWIN', 'VK_RWIN', 'VK_APPS', 'VK_SLEEP', 'VK_NUMPAD0', 'VK_NUMPAD1', 'VK_NUMPAD2', 'VK_NUMPAD3', 'VK_NUMPAD4', 'VK_NUMPAD5', 'VK_NUMPAD6', 'VK_NUMPAD7', 'VK_NUMPAD8', 'VK_NUMPAD9', 'VK_MULTIPLY', 'VK_ADD', 'VK_SEPARATOR', 'VK_SUBTRACT', 'VK_DECIMAL', 'VK_DIVIDE', 'VK_F1', 'VK_F2', 'VK_F3', 'VK_F4', 'VK_F5', 'VK_F6', 'VK_F7', 'VK_F8', 'VK_F9', 'VK_F10', 'VK_F11', 'VK_F12', 'VK_F13', 'VK_F14', 'VK_F15', 'VK_F16', 'VK_F17', 'VK_F18', 'VK_F19', 'VK_F20', 'VK_F21', 'VK_F22', 'VK_F23', 'VK_F24', 'VK_NUMLOCK', 'VK_SCROLL', 'VK_LSHIFT', 'VK_RSHIFT', 'VK_LCONTROL', 'VK_RCONTROL', 'VK_LMENU', 'VK_RMENU', 'VK_BROWSER_BACK', 'VK_BROWSER_FORWARD', 'VK_BROWSER_REFRESH', 'VK_BROWSER_STOP', 'VK_BROWSER_SEARCH', 'VK_BROWSER_FAVORITES', 'VK_BROWSER_HOME', 'VK_VOLUME_MUTE', 'VK_VOLUME_DOWN', 'VK_VOLUME_UP', 'VK_MEDIA_NEXT_TRACK', 'VK_MEDIA_PREV_TRACK', 'VK_MEDIA_STOP', 'VK_MEDIA_PLAY_PAUSE', 'VK_LAUNCH_MAIL', 'VK_LAUNCH_MEDIA_SELECT', 'VK_LAUNCH_APP1', 'VK_LAUNCH_APP2', 'VK_OEM_1', 'VK_OEM_PLUS', 'VK_OEM_COMMA', 'VK_OEM_MINUS', 'VK_OEM_PERIOD', 'VK_OEM_2', 'VK_OEM_3', 'VK_OEM_4', 'VK_OEM_5', 'VK_OEM_6', 'VK_OEM_7', 'VK_OEM_8', 'VK_OEM_102', 'VK_PROCESSKEY', 'VK_PACKET', 'VK_ATTN', 'VK_CRSEL', 'VK_EXSEL', 'VK_EREOF', 'VK_PLAY', 'VK_ZOOM', 'VK_NONAME', 'VK_PA1', 'VK_OEM_CLEAR'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["VK"]
      )
    );

    // • Activate - Register Completion Provider - VERSIONINFO VALUE Strings • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['VALUE "CompanyName", "MySoftware Company\\0"\n', 'VALUE "Contact e-mail", "MySoftware@gmail.com\\0"\n', 'VALUE "FileVersion", "1.0.0.0\\0"\n', 'VALUE "FileDescription", "Describe me\\0"\n', 'VALUE "InternalName", "Internal Name\\0"\n', 'VALUE "LegalCopyright", "Legal Copyright\\0"\n', 'VALUE "LegalTrademarks", "Legal Trademarks\\0"\n', 'VALUE "OriginalFilename", "Original Filename\\0"\n', 'VALUE "ProductName", "Product Name\\0"\n', 'VALUE "ProductVersion", "1.0.0.0\\0"\n', 'VALUE "Comment", "Comment\\0"\n', 'VALUE "PrivateBuild", "PrivateBuild\\0"\n', 'VALUE "SpecialBuild", "SpecialBuild\\0"\n', 'VALUE "NewKey", "NewValue\\0"\n', 'VALUE "Translation", 0x0409, 0x04E4'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["VA"]
      )
    );

    // • Activate - Register Completion Provider - Window Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['WS_BORDER', 'WS_CAPTION', 'WS_CHILD', 'WS_CHILDWINDOW', 'WS_CLIPCHILDREN', 'WS_CLIPSIBLINGS', 'WS_DISABLED', 'WS_DLGFRAME', 'WS_GROUP', 'WS_HSCROLL', 'WS_ICONIC', 'WS_MAXIMIZE', 'WS_MAXIMIZEBOX', 'WS_MINIMIZE', 'WS_MINIMIZEBOX', 'WS_OVERLAPPED', 'WS_OVERLAPPEDWINDOW', 'WS_POPUP', 'WS_POPUPWINDOW', 'WS_SIZEBOX', 'WS_SYSMENU', 'WS_TABSTOP', 'WS_THICKFRAME', 'WS_TILED', 'WS_TILEDWINDOW', 'WS_VISIBLE', 'WS_VSCROLL', 'WS_EX_ACCEPTFILES', 'WS_EX_APPWINDOW', 'WS_EX_CLIENTEDGE', 'WS_EX_COMPOSITED', 'WS_EX_CONTEXTHELP', 'WS_EX_CONTROLPARENT', 'WS_EX_DLGMODALFRAME', 'WS_EX_LAYERED', 'WS_EX_LAYOUTRTL', 'WS_EX_LEFT', 'WS_EX_LEFTSCROLLBAR', 'WS_EX_LTRREADING', 'WS_EX_MDICHILD', 'WS_EX_NOACTIVATE', 'WS_EX_NOINHERITLAYOUT', 'WS_EX_NOPARENTNOTIFY', 'WS_EX_NOREDIRECTIONBITMAP', 'WS_EX_OVERLAPPEDWINDOW', 'WS_EX_PALETTEWINDOW', 'WS_EX_RIGHT', 'WS_EX_RIGHTSCROLLBAR', 'WS_EX_RTLREADING', 'WS_EX_STATICEDGE', 'WS_EX_TOOLWINDOW', 'WS_EX_TOPMOST', 'WS_EX_TRANSPARENT', 'WS_EX_WINDOWEDGE'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["WS"]
      )
    );

    // • Activate - Register Completion Provider - Dialog Window Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['DS_ABSALIGN', 'DS_SYSMODAL', 'DS_FIXEDSYS', 'DS_NOFAILCREATE', 'DS_SETFONT', 'DS_MODALFRAME', 'DS_NOIDLEMSG', 'DS_SETFOREGROUND', 'DS_CONTROL', 'DS_CENTER', 'DS_CENTERMOUSE', 'DS_CONTEXTHELP'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["DS"]
      )
    );

    // • Activate - Register Completion Provider - Scrollbar Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['SBS_BOTTOMALIGN', 'SBS_HORZ', 'SBS_LEFTALIGN', 'SBS_RIGHTALIGN', 'SBS_SIZEBOX', 'SBS_SIZEBOXBOTTOMRIGHTALIGN', 'SBS_SIZEBOXTOPLEFTALIGN', 'SBS_SIZEGRIP', 'SBS_VERT'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["SB"]
      )
    );

    // • Activate - Register Completion Provider - Font Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['FW_DONTCARE', 'FW_THIN', 'FW_EXTRALIGHT', 'FW_LIGHT', 'FW_NORMAL', 'FW_MEDIUM', 'FW_SEMIBOLD', 'FW_BOLD', 'FW_EXTRABOLD', 'FW_HEAVY'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["FW"]
      )
    );

    // • Activate - Register Completion Provider - Button Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['BS_3STATE', 'BS_AUTO3STATE', 'BS_AUTOCHECKBOX', 'BS_AUTORADIOBUTTON', 'BS_BITMAP', 'BS_BOTTOM', 'BS_CENTER', 'BS_CHECKBOX', 'BS_COMMANDLINK', 'BS_DEFCOMMANDLINK', 'BS_DEFPUSHBUTTON', 'BS_FLAT', 'BS_GROUPBOX', 'BS_ICON', 'BS_LEFT', 'BS_LEFTTEXT', 'BS_MULTILINE', 'BS_NOTIFY', 'BS_OWNERDRAW', 'BS_PUSHBUTTON', 'BS_PUSHLIKE', 'BS_RADIOBUTTON', 'BS_RIGHT', 'BS_RIGHTBUTTON', 'BS_SPLITBUTTON', 'BS_TEXT', 'BS_TOP', 'BS_USERBUTTON', 'BS_VCENTER', 'BS_PUSHBOX'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["BS"]
      )
    );

    // • Activate - Register Completion Provider - Static Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['SS_BITMAP', 'SS_BLACKFRAME', 'SS_BLACKRECT', 'SS_CENTERIMAGE', 'SS_ENDELLIPSIS', 'SS_ETCHEDFRAME', 'SS_ETCHEDHORZ', 'SS_ETCHEDVERT', 'SS_GRAYFRAME', 'SS_GRAYRECT', 'SS_ICON', 'SS_LEFT', 'SS_LEFTNOWORDWRAP', 'SS_NOPREFIX', 'SS_NOTIFY', 'SS_OWNERDRAW', 'SS_PATHELLIPSIS', 'SS_REALSIZEIMAGE', 'SS_RIGHT', 'SS_SIMPLE', 'SS_SUNKEN', 'SS_USERITEM', 'SS_WHITEFRAME', 'SS_WORDELLIPSIS', 'SS_CENTER'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["SS"]
      )
    );

    // • Activate - Register Completion Provider - Combobox Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['CBS_AUTOHSCROLL', 'CBS_DISABLENOSCROLL', 'CBS_DROPDOWN', 'CBS_DROPDOWNLIST', 'CBS_HASSTRINGS', 'CBS_LOWERCASE', 'CBS_NOINTEGRALHEIGHT', 'CBS_OEMCONVERT', 'CBS_OWNERDRAWFIXED', 'CBS__OWNERDRAWVARIABLE', 'CBS_SIMPLE', 'CBS_SORT', 'CBS_UPPERCASE'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["CB"]
      )
    );

    // • Activate - Register Completion Provider - Listbox Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['LBS_DISABLENOSCROLL', 'LBS_EXTENDEDSEL', 'LBS_HASSTRINGS', 'LBS_MULTICOLUMN', 'LBS_MULTIPLESEL', 'LBS_NODATA', 'LBS_NOINTEGRALHEIGHT', 'LBS_NOREDRAW', 'LBS_NOSEL', 'LBS_NOTIFY', 'LBS_OWNERDRAWFIXED', 'LBS_OWNERDRAWVARIABLE', 'LBS_SORT', 'LBS_STANDARD', 'LBS_USETABSTOPS', 'LBS_WANTKEYBOARDINPUT'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["LB"]
      )
    );

    // • Activate - Register Completion Provider - Tab Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['TCS_BOTTOM', 'TCS_BUTTONS', 'TCS_FIXEDWIDTH', 'TCS_FLATBUTTONS', 'TCS_FOCUSNEVER', 'TCS_FOCUSONBUTTONDOWN', 'TCS_FORCEICONLEFT', 'TCS_FORCELABELLEFT', 'TCS_HOTTRACK', 'TCS_MULTILINE', 'TCS_MULTISELECT', 'TCS_OWNERDRAWFIXED', 'TCS_RAGGEDRIGHT', 'TCS_RIGHT', 'TCS_RIGHTJUSTIFY', 'TCS_SCROLLOPPOSITE', 'TCS_SINGLELINE', 'TCS_TABS', 'TCS_TOOLTIPS', 'TCS_VERTICAL'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["TC"]
      )
    );

    // • Activate - Register Completion Provider - Treeview Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['TVS_CHECKBOXES', 'TVS_DISABLEDRAGDROP', 'TVS_EDITLABELS', 'TVS_FULLROWSELECT', 'TVS_HASBUTTONS', 'TVS_HASLINES', 'TVS_INFOTIP', 'TVS_LINESATROOT', 'TVS_NOHSCROLL', 'TVS_NONEVENHEIGHT', 'TVS_NOSCROLL', 'TVS_NOTOOLTIPS', 'TVS_RTLREADING', 'TVS_SHOWSELALWAYS', 'TVS_SINGLEEXPAND', 'TVS_TRACKSELECT'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["TV"]
      )
    );

    // • Activate - Register Completion Provider - Listview Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['LVS_ALIGNLEFT', 'LVS_ALIGNTOP', 'LVS_AUTOARRANGE', 'LVS_EDITLABELS', 'LVS_ICON', 'LVS_LIST', 'LVS_NOCOLUMNHEADER', 'LVS_NOLABELWRAP', 'LVS_NOSCROLL', 'LVS_NOSORTHEADER', 'LVS_OWNERDATA', 'LVS_OWNERDRAWFIXED', 'LVS_REPORT', 'LVS_SHAREIMAGELISTS', 'LVS_SHOWSELALWAYS', 'LVS_SINGLESEL', 'LVS_SMALLICON', 'LVS_SORTASCENDING', 'LVS_SORTDESCENDING'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["LV"]
      )
    );

    // • Activate - Register Completion Provider - Progressbar Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['PBS_MARQUEE', 'PBS_SMOOTH', 'PBS_VERTICAL'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["PB"]
      )
    );

    // • Activate - Register Completion Provider - Toolbar Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['TBSTYLE_ALTDRAG', 'TBSTYLE_AUTOSIZE', 'TBSTYLE_CUSTOMERASE', 'TBSTYLE_FLAT', 'TBSTYLE_LIST', 'TBSTYLE_REGISTERDROP', 'TBSTYLE_TOOLTIPS', 'TBSTYLE_TRANSPARENT', 'TBSTYLE_WRAPABLE'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["TB"]
      )
    );

    // • Activate - Register Completion Provider - Common Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['CCS_ADJUSTABLE', 'CCS_BOTTOM', 'CCS_LEFT', 'CCS_NODIVIDER', 'CCS_NOMOVEX', 'CCS_NOMOVEY', 'CCS_NOPARENTALIGN', 'CCS_NORESIZE', 'CCS_RIGHT', 'CCS_TOP', 'CCS_VERT'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["CC"]
      )
    );

    // • Activate - Register Completion Provider - Up/Down Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['UDS_ALIGNLEFT', 'UDS_ALIGNRIGHT', 'UDS_ARROWKEYS', 'UDS_AUTOBUDDY', 'UDS_HORZ', 'UDS_HOTTRACK', 'UDS_NOTHOUSANDS', 'UDS_SETBUDDYINT', 'UDS_WRAP'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["UD"]
      )
    );

    // • Activate - Register Completion Provider - Statusbar Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['SBARS_SIZEGRIP', 'SBARS_TOOLTIPS', 'SBT_TOOLTIPS'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["SB"]
      )
    );

    // • Activate - Register Completion Provider - Date/Time Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['DTS_APPCANPARSE', 'DTS_LONGDATEFORMAT', 'DTS_RIGHTALIGN', 'DTS_SHORTDATEFORMAT', 'DTS_SHOWNONE', 'DTS_TIMEFORMAT', 'DTS_UPDOWN'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["DT"]
      )
    );

    // • Activate - Register Completion Provider - Month Calendar Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['MCS_DAYSTATE', 'MCS_MULTISELECT', 'MCS_NOTODAY', 'MCS_NOTODAYCIRCLE', 'MCS_WEEKNUMBERS'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["MC"]
      )
    );

    // • Activate - Register Completion Provider - Edit Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['ES_AUTOHSCROLL', 'ES_AUTOVSCROLL', 'ES_CENTER', 'ES_DISABLENOSCROLL', 'ES_LEFT', 'ES_MULTILINE', 'ES_NOHIDESEL', 'ES_PASSWORD', 'ES_READONLY', 'ES_RIGHT', 'ES_SAVESEL', 'ES_SELECTIONBAR', 'ES_SUNKEN', 'ES_VERTICAL', 'ES_WANTRETURN'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["ES"]
      )
    );

    // • Activate - Register Completion Provider - Animation Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['ACS_AUTOPLAY', 'ACS_CENTER', 'ACS_TIMER', 'ACS_TRANSPARENT'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["AC"]
      )
    );

    // • Activate - Register Completion Provider - Pager Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['PGS_AUTOSCROLL', 'PGS_DRAGNDROP', 'PGS_HORZ', 'PGS_VERT'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["PG"]
      )
    );

    // • Activate - Register Completion Provider - Rebar Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['RBS_AUTOSIZE', 'RBS_BANDBORDERS', 'RBS_DBLCLKTOGGLE', 'RBS_FIXEDORDER', 'RBS_REGISTERDROP', 'RBS_TOOLTIPS', 'RBS_VARHEIGHT', 'RBS_VERTICALGRIPPER'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["RB"]
      )
    );

    // • Activate - Register Completion Provider - Header Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['HDS_BUTTONS', 'HDS_DRAGDROP', 'HDS_FILTERBAR', 'HDS_FULLDRAG', 'HDS_HIDDEN', 'HDS_HORZ', 'HDS_HOTTRACK'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["HD"]
      )
    );

    // • Activate - Register Completion Provider - SysLink Control Styles • 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
      ['rc-script'],
        {
          provideCompletionItems(document, position) {
            return ['LWS_IGNORERETURN', 'LWS_NOPREFIX', 'LWS_RIGHT', 'LWS_TRANSPARENT', 'LWS_USECUSTOMTEXT', 'LWS_USEVISUALSTYLE'].map(item => {
                let completionItem = new vscode.CompletionItem(item);
                completionItem.range = new vscode.Range(position.line, position.character-1, position.line, position.character);
                return completionItem;
            })
          }
        },
      ...["LW"]
      )
    );

};

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function setEditor ●                            │
//  │                                                                              │
//  │                  • Set External RC Script Editor Location •                  │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
async function setEditor() {

  // setEditor - Get Global Notes Folder From User 
  const options = OpenDialogOptions = {
      title: "Select Location for External RC Script File Editor",
      canSelectMany: false,
      canSelectFolders: false,
      canSelectFiles: true,
      filters: { Executable: ['exe']},
      openLabel: "Select RC Script File Editor"
  };
  const exeUri = await vscode.window.showOpenDialog(options);
  if (exeUri && exeUri[0]) {
    let settings = vscode.workspace.getConfiguration("rc-script");
    settings.update("fullPathToEditor",exeUri[0].fsPath,1);
  }
};


//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                            ● Function runEditor ●                            │
//  │                                                                              │
//  │                          • runEditor Description •                           │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function runEditor() {
    let settings = vscode.workspace.getConfiguration("rc-script");
    let command = settings.get("fullPathToEditor");
    if (!command) {
      vscode.window
      .showWarningMessage("Editor has not been defined in settings. Would you like to set the location now?", 'Yes', 'No')
      .then(async answer => {
        if (answer === "Yes") {
          await setEditor().then();
          await new Promise(r => setTimeout(r, 1000));    // Need extra delay to get settings
          let settings = vscode.workspace.getConfiguration("rc-script");
          let command = settings.get("fullPathToEditor");
          if (!command) {
            return;   // User cancelled
          }
          let args = [vscode.window.activeTextEditor.document.uri.fsPath];
          let cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
          try {
              process.spawn(command, args, {
                  cwd: cwd
              });
          }
          catch (err) {
              console.log(err);
          }
        } else {
          return;
        }
      })
    } else {
      let args = [vscode.window.activeTextEditor.document.uri.fsPath];
      let cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
      try {
          process.spawn(command, args, {
              cwd: cwd
          });
      }
      catch (err) {
          console.log(err);
      }
    }
};

//  ╭──────────────────────────────────────────────────────────────────────────────╮
//  │                           ● Function deactivate ●                            │
//  │                                                                              │
//  │                       • Deactivate Extension Cleanup •                       │
//  ╰──────────────────────────────────────────────────────────────────────────────╯
function deactivate() {
  if (customTaskProvider) {
		customTaskProvider.dispose();
	}
}