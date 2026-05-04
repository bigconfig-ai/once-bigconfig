# Meetup Talk Application — DevOps Berlin

**Event:** DevOps Berlin (AI-first audience)
**Length:** 25 minutes
**Language:** English

---

## 1. How should we introduce you and your talk?

Alberto Miorin is the founder of BigConfig, an infrastructure package manager built on the bet that Claude — not humans — should be operating production. In the next 25 minutes he'll argue that everything we call Infrastructure as Code is really Infrastructure as *Alpha* Code, and show what falls out when you design for the agent first: data-only desired state, packages that ship their own DevOps, and a marketplace of CLIs the agent can drive. Please welcome Alberto.

---

## 2. Talk Title

**Stop Writing Terraform Modules: Infrastructure as Alpha Code**

---

## 3. Talk Description

We've been calling it Infrastructure as Code for fifteen years. Be honest — it's Infrastructure as *Alpha* Code. Every team reinvents the same Terraform module, the same Helm chart, the same bash glue. We ship modules per tool but have zero encapsulation across tools, no real abstractions, and no package manager worth the name.

This talk is about what changes when you assume Claude is the operator, not a human. If an agent is in the loop, the desired state should be **data**, not code. DevOps logic should live **inside packages** you can install. And the interface to your infrastructure should be a **marketplace of CLIs** — because that's the surface agents actually drive well.

I'll demo the Once BigConfig package: one install, agent-operated, no Terraform modules to maintain.

**Target audience:** DevOps and platform engineers tired of rewriting the same wheel, and AI engineers who want to see what infra looks like when you design for the agent first.

**Key takeaways:**
- Why IaC is still alpha, and what a v1 looks like
- Desired state as pure data — not imperative dressed up as declarative
- Packaging DevOps so the next team doesn't reinvent it
- Why CLIs (not SDKs, not APIs) are the right surface for Claude

---

## 4. Short Bio

Alberto Miorin is the founder of BigConfig (bigconfig.ai), an infrastructure package manager designed for the agent era. He builds in the open at github.com/amiorin.
