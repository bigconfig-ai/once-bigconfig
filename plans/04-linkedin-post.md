# LinkedIn post copy

INCIDENT IN PROD.

This is the failure mode DevOps teams need to design for before putting agents near production:

One over-permissioned agent prompt can take production down.

The dangerous pattern is simple:

- The agent runs on a developer laptop or shared workstation
- It has the same credentials as the human operator
- It can call tools that create, delete, mutate, and inspect production
- The only boundary is “the agent should know what I meant”

That is not a safety model. That is operator-level access with a probabilistic interface.

The pattern I prefer with BigConfig Packages:

1. Run the agent inside a disposable container.
2. Expose infrastructure through package verbs: create, delete, validate, describe.
3. Use full credentials only for create and delete.
4. Use read-only credentials for validate and describe.
5. Use SSH ForceCommand CLIs instead of MCPs for production actions.

Don’t create MCPs for production actions.

An MCP is not a credentials boundary. If the agent can reach a server that can mutate production with broad credentials, the blast radius is still production.

A narrow CLI behind SSH ForceCommand is easier to reason about:

- what command can run
- what credentials it receives
- what package verb it maps to
- what logs and audit trail you get
- what can be safely exposed as read-only

Containers do not magically make production safe. But a disposable execution environment + package verbs + credential separation + ForceCommand gives the agent a smaller, explicit operating surface.

Run it in a disposable container:

```bash
npx bc-pkg bigconfig-ai/bc-pkg shell
```

Docs:
https://bigconfig.ai/
https://bigconfig-ai.github.io/bc-pkg/

#DevOps #SRE #AI #Infrastructure #PlatformEngineering #BigConfig
