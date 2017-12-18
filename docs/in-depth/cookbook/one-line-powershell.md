# One-line PowerShell setup

> **TODO:** Make sure this works with v3.0.

[@ChrisTaylorRocks](https://github.com/ChrisTaylorRocks) has made a PowerShell script to get the starter kit up and running with a single command. Go check it out [here](https://github.com/ChrisTaylorRocks/screeps-typescript-starter-setup)!

## Usage

PowerShell < 5.0:

```
PS> (new-object Net.WebClient).DownloadString('http://bit.ly/2z2QDJI') | iex; New-ScreepsTypeScriptSetup
```

PowerShell 5.0+:

```
PS> curl http://bit.ly/2z2QDJI | iex; New-ScreepsTypeScriptSetup
```
