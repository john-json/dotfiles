<h1 data-loc-id="walkthrough.windows.install.compiler">Instalace kompilátoru jazyka C++ v systému Windows</h1>
<p data-loc-id="walkthrough.windows.text1">Pokud provádíte vývoj C++ pro Windows, doporučujeme nainstalovat kompilátor Microsoft Visual C++ (MSVC).</p>
<ol>
<li><p data-loc-id="walkthrough.windows.text2">Pokud chcete nainstalovat MSVC, otevřete terminál VS Code (CTRL&nbsp;+&nbsp;`) a&nbsp;vložte následující příkaz:
</p><pre><code style="white-space: pre-wrap;">winget install Microsoft.VisualStudio.2022.BuildTools --force --override "--wait --passive --add Microsoft.VisualStudio.Workload.VCTools --add Microsoft.VisualStudio.Component.VC.Tools.x86.x64 --add Microsoft.VisualStudio.Component.Windows11SDK.22000"</code></pre>
</li>
<blockquote>
<p><strong data-loc-id="walkthrough.windows.note1">Poznámka</strong>: <span data-loc-id="walkthrough.windows.note1.text">Můžete použít sadu nástrojů C++ z Visual Studio Build Tools spolu s Visual Studio Code ke kompilaci, sestavení a ověření jakékoli kódové báze C++, pokud máte také platnou licenci Visual Studio (buď Community, Pro nebo Enterprise), kterou aktivně používáte k vývoji kódové báze C++.</span></p>
</blockquote>

</ol>
<h2 data-loc-id="walkthrough.windows.verify.compiler">Ověřování instalace kompilátoru</h2>
<ol>
<li><p data-loc-id="walkthrough.windows.open.command.prompt">Otevřete ho <strong>Developer Command Prompt for VS</strong> zadáním „<code>developer</code>“ v nabídce Start ve Windows.</p>
</li>
<li><p data-loc-id="walkthrough.windows.check.install">Zkontrolujte instalaci MSVC zadáním <code>cl</code> do nástroje <span>Developer Command Prompt for VS</span>. Měla by se zobrazit zpráva o autorských právech v popisu verze a základního použití.</p>
<blockquote>
<p><strong data-loc-id="walkthrough.windows.note2">Poznámka</strong>: <span data-loc-id="walkthrough.windows.note2.text">Pokud chcete použít MSVC z příkazového řádku nebo VS Code, musíte spouštět z <strong>Developer Command Prompt for VS</strong>. Běžné prostředí, jako je <span>PowerShell</span>, <span>Bash</span> nebo příkazový řádek Windows, nemá nastavenou nezbytnou proměnnou prostředí cesty.</span></p>
</blockquote>
</li>
</ol>
<h2 data-loc-id="walkthrough.windows.other.compilers">Další možnosti kompilátoru</h2>
<p data-loc-id="walkthrough.windows.text3">Pokud cílíte na Linux z Windows, podívejte se na <a href="https://code.visualstudio.com/docs/cpp/config-wsl" data-loc-id="walkthrough.windows.link.title1">Použití C++ a subsystému Windows pro Linux (WSL) ve VS Code</a>. Nebo můžete <a href="https://code.visualstudio.com/docs/cpp/config-mingw" data-loc-id="walkthrough.windows.link.title2">instalovat GCC na Windows pomocí MinGW</a>.</p>