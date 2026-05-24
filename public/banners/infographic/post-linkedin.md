BigConfig now supports Clojure, TypeScript, and Python.

When we started, we built BigConfig in Clojure because we believed config-as-code deserved a real language. The challenge was always: how do you support more languages without splitting the ecosystem?

Coding agents changed the answer.

Agents can now maintain three first-class implementations in parallel — and the rendered config files themselves act as the test suite. If the output matches, the implementation is correct. No mocks, no parity bugs.

What this unlocks:
• Author packages in the language your team already uses
• One shared definition powers every implementation
• Infrastructure-as-code without the weight of CDK or Pulumi

Define once. Run everywhere.

👉 bigconfig.ai
