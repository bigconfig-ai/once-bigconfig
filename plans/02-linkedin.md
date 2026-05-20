# LinkedIn Post — Install in One Prompt Campaign

**Voice:** Founder, personal · **Goal:** Drive trial/installs · **Tone:** Technical & credible · **Length:** Long-form narrative
**Attach:** `public/install-prompt.png` (or `@2x` for retina)

---

A few years into building infrastructure tooling, I noticed the same pattern everywhere.

Every tool ships its own YAML DSL. Its own templating. Its own conditionals, loops, and "expression language" that is just a worse Lisp reinvented one feature at a time. We don't configure infrastructure anymore — we maintain a dozen half-languages that don't compose with each other.

So I built BigConfig: an infrastructure package manager where configuration is real code (Clojure), packages are versioned and composable, and the whole thing is designed to be driven by an agent rather than copy-pasted from a wiki.

Here's the part I'm proud of. There's no install script to study, no getting-started guide to skim, no flags to memorize. You hand one line to your AI coding agent:

run npx bc-pkg bigconfig-ai/once validate and iterate on failures

That's it. The agent pulls the package set, runs validation, reads the failures, fixes them, and re-runs until your configuration is green. You review a working result instead of assembling one by hand. The feedback loop that used to be a human in a terminal is now a tight machine loop — and validation is the contract that keeps it honest.

I think this is what "agentic" should actually mean: not a chatbot bolted onto a CLI, but a tool whose primary interface *is* the loop between an agent and a verifier.

It's open source. If you run infrastructure and you're tired of debugging templating languages, paste that prompt into Claude Code (or your agent of choice) and watch it converge.

→ bigconfig.ai

What's the worst config DSL you've had to fight this year? Genuinely curious.

#DevOps #PlatformEngineering #Infrastructure #Clojure #AIAgents #OpenSource
