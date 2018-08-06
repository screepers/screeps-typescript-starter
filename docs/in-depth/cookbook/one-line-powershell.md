# One-line PowerShell setup

{% hint style="warning" %}
**Note:** As of v3.0, this no longer works. This issue is being tracked [here](https://github.com/ChrisTaylorRocks/screeps-typescript-starter-setup/issues/1).
{% endhint %}

[@ChrisTaylorRocks](https://github.com/ChrisTaylorRocks) has made a PowerShell script to get the starter kit up and running with a single command. Go check it out [here](https://github.com/ChrisTaylorRocks/screeps-typescript-starter-setup)!

## Usage

PowerShell &lt; 5.0:

```text
PS> (new-object Net.WebClient).DownloadString('http://bit.ly/2z2QDJI') | iex; New-ScreepsTypeScriptSetup
```

PowerShell 5.0+:

```text
PS> curl http://bit.ly/2z2QDJI | iex; New-ScreepsTypeScriptSetup
```

