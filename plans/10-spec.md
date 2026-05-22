# BigConfig Package Specification v1

> Language-agnostic infrastructure package specification.
> If validation passes, create must work.

---

## 1. Overview

BigConfig is a **specification + library** for reusable, validated infrastructure packages.

- A **BigConfig package** is a GitHub monorepo conforming to a defined structure.
- A **BigConfig library** is a language-native implementation (Clojure, TypeScript, Python, etc.) that can validate, render, and orchestrate packages.
- Users consume BigConfig packages via their native package manager (npm, PyPI, Clojars) and operate them via the BigConfig library in their language of choice.

### 1.1 Core Guarantee

The defining contract of a BigConfig package:

> **If `validate` passes, `create` must work.**

Validation is not a lint check — it is a proof that the rendered output will succeed against the target infrastructure. A validated package is a deployable package.

---

## 2. Monorepo Structure

Every BigConfig package lives in a GitHub repository with the following structure:

```
bigconfig-ai/<package-name>/
├── bigconfig/                  # (Required) Shared configuration templates
│   ├── terraform/              #   Terraform/OpenTofu templates
│   ├── ansible/                #   Ansible templates
│   └── schema.edn              #   Parameter schema and validation rules
├── clojure/                    # Clojure implementation
│   ├── package.clj             #   Workflow composition
│   ├── tools.clj               #   Tool-specific implementations
│   └── deps.edn                #   Clojure dependencies
├── typescript/                 # TypeScript implementation (npm)
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── python/                     # Python implementation (PyPI)
│   ├── src/
│   └── pyproject.toml
├── bigconfig.json              # (Required) Package manifest
├── LICENSE
└── README.md
```

### 2.1 Conventions

| Convention | Rule |
|---|---|
| **Language folders** | Named by language, lowercase: `clojure/`, `typescript/`, `python/` |
| **Shared templates** | Always in `bigconfig/` at the repo root |
| **Package manifest** | Always `bigconfig.json` at the repo root |
| **Lifecycle symmetry** | Every `create` has a corresponding `delete` |
| **Determinism** | Given the same inputs, a package produces the same output |

### 2.2 Optional Language Implementations

A package may implement any subset of languages. The `bigconfig/` templates are always present. An empty language folder is valid — it means the package is unavailable in that ecosystem.

---

## 3. Package Manifest (`bigconfig.json`)

Every package must have a `bigconfig.json` at the repository root.

```json
{
  "name": "@bigconfig/once",
  "version": "1.0.0",
  "description": "Self-host ONCE apps on your infrastructure",
  "author": "amiorin",
  "repository": "https://github.com/bigconfig-ai/once",
  "languages": ["clojure", "typescript", "python"],
  "schema": "bigconfig/schema.edn",
  "lifecycle": ["validate", "create", "delete", "describe"],
  "providers": {
    "compute": ["oci", "hcloud", "no-infra"],
    "dns": ["cloudflare"],
    "smtp": ["resend"],
    "backend": ["s3"]
  },
  "templates": {
    "terraform": "bigconfig/terraform",
    "ansible": "bigconfig/ansible"
  }
}
```

| Field | Required | Description |
|---|---|---|
| `name` | Yes | Package name, namespaced per ecosystem convention |
| `version` | Yes | Semver |
| `description` | Yes | Short description |
| `repository` | Yes | Source repository URL |
| `languages` | Yes | List of available language implementations |
| `schema` | Yes | Path to the parameter schema file |
| `lifecycle` | Yes | Supported lifecycle commands |
| `providers` | No | Supported provider backends (compute, DNS, SMTP, etc.) |
| `templates` | Yes | Mapping of template engine to directory path |

### 3.5 Standardized Options Format (`options.yaml`)

The Clojure implementation defines options inline in `options.clj` — maps of provider parameters
and profile compositions merged together. For cross-language compatibility, these must be
standardized into a **YAML-based options format** that every language implementation can parse.

Two files live alongside `bigconfig.json` at the repository root:

| File | Purpose |
|---|---|
| `providers.yaml` | Defines every available provider's parameter schema (types, defaults, placeholders, secrets) |
| `profiles.yaml` | Defines named compositions of providers with application-specific parameter values |

#### 3.5.1 `providers.yaml`

Each provider category (`smtp`, `dns`, `backend`, `compute`) has a `_dispatch` key pointing
to the parameter that selects the provider (e.g., `provider-compute`). Every provider defines
its parameters with:

| Field | Description |
|---|---|
| `type` | Data type: `string`, `integer`, `boolean` |
| `default` | Default value when not supplied |
| `placeholder` | Sentinel value indicating the user must replace it |
| `secret` | If `true`, mask in logs and CLI output |
| `value` | Literal fixed value (for dispatch keys like `"oci"`) |
| `description` | Human-readable description |

```yaml
# providers.yaml (excerpt)
compute:
  _dispatch: provider-compute

  oci:
    params:
      provider-compute:
        type: string
        value: "oci"
      oci-shape:
        type: string
        default: "VM.Standard.A1.Flex"
      oci-ocpus:
        type: integer
        default: 1
      oci-ssh-authorized-keys:
        type: string
        placeholder: "REPLACE_ME"

  hcloud:
    params:
      provider-compute:
        type: string
        value: "hcloud"
      hcloud-token:
        type: string
        placeholder: "REPLACE_ME"
        secret: true
```

See `plans/providers.yaml` for the complete reference.

#### 3.5.2 `profiles.yaml`

Profiles select one provider from each category and provide application-specific parameters.

```yaml
# profiles.yaml (excerpt)
alpha:
  profile: "profile-alpha"
  providers:
    smtp: resend
    dns: cloudflare
    backend: r2
    compute: digitalocean
  params:
    domain: "alpha.example.com"
    package: "profile-alpha"
    once:
      applications:
        - host: "www.alpha.example.com"
          image: "ghcr.io/bigconfig-ai/once-bigconfig:latest"
```

See `plans/profiles.yaml` for the complete reference.

#### 3.5.3 Resolution Algorithm

A language implementation resolves a profile by:

1. Reading the selected profile from `profiles.yaml`
2. For each provider category, reading the selected provider's params from `providers.yaml`
3. Applying deploy-level params (e.g., SSH keys)
4. Merging the profile's application-specific `params` on top
5. Overriding with any user-supplied CLI values

This replaces the Clojure `merge-with merge` pattern with a portable, declarative format.

---

## 4. The `bigconfig/` Directory

The `bigconfig/` directory holds **shared infrastructure templates** consumed by all language implementations.

### 4.1 Template Directory

Each template engine gets its own subdirectory:

```
bigconfig/
├── terraform/
│   ├── main.tf           # Terraform/OpenTofu template
│   ├── variables.tf      # Variable definitions
│   ├── outputs.tf        # Standardized output schema
│   └── {{ hyperscaler }}/
│       ├── main.tf       # Provider-specific override
│       └── variables.tf  # Provider-specific variables
├── ansible/
│   ├── playbook.yml      # Ansible playbook template
│   └── {{ hyperscaler }}/
│       └── playbook.yml  # Provider-specific playbook
└── schema.edn            # Parameter schema
```

### 4.2 Template Variables

Templates use `{{ variable-name }}` placeholder syntax. Variables are resolved from the parameter schema at render time.

Built-in variables:
| Variable | Description |
|---|---|
| `{{ hyperscaler }}` | Target cloud provider (e.g., `oci`, `hcloud`) |
| `{{ domain }}` | Deployment domain name |
| `{{ package }}` | Package name |

### 4.3 Standardized Output Schema

Terraform/OpenTofu outputs must conform to a standardized schema for cross-tool handoff:

```hcl
output "params" {
  value = {
    ip     = <server-public-ip>
    sudoer = <default-ssh-user>     # e.g., "ubuntu", "root"
    uid    = <default-user-uid>     # e.g., "1001"
  }
}
```

This schema allows the tool-agnostic renderer to pass connection parameters from the infrastructure layer (Terraform) to the configuration layer (Ansible) regardless of provider.

### 4.4 Parameter Schema (`schema.edn`)

The schema defines all user-supplied parameters, their types, validation rules, and defaults.

```clojure
{:domain                           {:type :string
                                    :required true
                                    :description "Deployment domain name"}

 :package                          {:type :string
                                    :required false
                                    :default "default"
                                    :description "Package identifier"}

 :once                             {:type :map
                                    :required true
                                    :description "Application configuration"
                                    :schema
                                    {:applications {:type :vector
                                                    :required true
                                                    :schema
                                                    {:host  {:type :string :required true}
                                                     :image {:type :string :required true}}}}}

 :provider-compute                 {:type :keyword
                                    :required true
                                    :allowed #{:oci :hcloud :no-infra}
                                    :description "Compute provider"}

 :oci-config-file-profile          {:type :string
                                    :required false
                                    :default "DEFAULT"}

 :oci-shape                        {:type :string
                                    :required false
                                    :default "VM.Standard.A1.Flex"}

 ;; ... provider-specific parameters follow same pattern
}
```

---

## 5. Validation Contract

Validation is the heart of the BigConfig guarantee. The `validate` command must pass all checks before `create` can be invoked.

### 5.1 Validation Layers

| Layer | Check | Failure |
|---|---|---|
| **Schema** | All required parameters present, types correct, values in allowed sets | Reject with specific parameter errors |
| **Templates** | Template syntax valid, all variables resolvable, no dangling `{{ }}` | Reject with template errors |
| **Preconditions** | Provider credentials valid, resource quotas not exceeded, naming collisions absent | Reject with precondition errors |
| **Dry-run** | Rendered output is semantically valid (e.g., `terraform plan` succeeds) | Reject with dry-run errors |
| **State** | No conflicting existing state, lock available | Reject with state errors |

### 5.2 The Guarantee

If all five validation layers pass, the BigConfig library guarantees:

1. `create` will not fail due to input or template errors.
2. `create` will produce a known, deterministic result.
3. `delete` will cleanly reverse `create` (resource symmetry).
4. Multiple invocations with the same inputs produce the same result (idempotency).

### 5.3 Validation Output

```json
{
  "status": "pass" | "fail",
  "checks": [
    {
      "layer": "schema",
      "passed": true
    },
    {
      "layer": "templates",
      "passed": true
    },
    {
      "layer": "preconditions",
      "passed": true
    },
    {
      "layer": "dry-run",
      "passed": true,
      "summary": "3 resources to create, 0 to destroy"
    },
    {
      "layer": "state",
      "passed": true
    }
  ]
}
```

---

## 6. Lifecycle Commands

Every language implementation must support these commands:

| Command | Description |
|---|---|
| `validate` | Run all validation layers (see §5) |
| `create` | Provision infrastructure and deploy the package |
| `delete` | Tear down all resources created by `create` |
| `describe` | Print current package state and parameters |
| `plan` | Show what `create` would do without executing (optional) |

### 6.1 Command Interface

Each language implementation exposes these commands in its native idiom:

| Language | Interface |
|---|---|
| **Clojure** | `bb <package-name> <command>` (via `bb.edn` tasks) |
| **TypeScript** | `npx <package-name> <command>` (via npm bin scripts) |
| **Python** | `pipx run <package-name> <command>` (via PyPI entry points) |

### 6.2 Workflow Composition

Language implementations may compose commands into higher-level workflows. A typical `create` workflow:

```
render → git-check → lock → exec → git-push → unlock-any
```

Where:
- `render`: Process templates against parameters
- `git-check`: Ensure working directory is clean and up-to-date
- `lock`: Acquire a distributed lock for the target profile
- `exec`: Execute the tool-specific commands (e.g., `tofu apply`, `ansible-playbook`)
- `git-push`: Push any state changes to the repository
- `unlock-any`: Release the lock

---

## 7. Language Implementation Requirements

Every language implementation of the BigConfig library must provide:

### 7.1 Core Functions

```typescript
interface BigConfigPackage {
  /** Validate the package against the schema and preconditions */
  validate(params: PackageParams): ValidationResult;

  /** Create/provision the package */
  create(params: PackageParams): Promise<CreateResult>;

  /** Delete/teardown the package */
  delete(params: PackageParams): Promise<DeleteResult>;

  /** Describe current package state */
  describe(params: PackageParams): PackageState;

  /** Render templates without executing */
  render(params: PackageParams): RenderedOutput;
}
```

### 7.2 Shared Behaviors

| Behavior | Requirement |
|---|---|
| **Template rendering** | Must use the same variable substitution semantics as all other implementations |
| **Schema validation** | Must parse `schema.edn` and validate parameters identically |
| **Standardized output** | Must consume and produce the standardized `{ip, sudoer, uid}` output schema |
| **Provider abstraction** | Must support the same set of provider backends (compute, DNS, SMTP, backend) |
| **Locking** | Must use the same locking protocol for team coordination |
| **State management** | Must persist state in the same format and location |

### 7.3 Template Engine Interface

Each language implementation includes a template engine that:

1. Reads templates from `bigconfig/<engine>/`
2. Resolves `{{ variable }}` placeholders against the parameter map
3. Supports directory-level overrides via `{{ hyperscaler }}` subdirectories
4. Writes rendered output to a configurable target directory
5. Returns file paths of rendered outputs

### 7.4 Provider Plugin Interface

Providers (compute, DNS, SMTP, backend) are abstracted behind a common interface:

```typescript
interface Provider {
  name: string;
  validate(params: ProviderParams): Promise<ValidationResult>;
  create(params: ProviderParams): Promise<ProviderResult>;
  delete(params: ProviderParams): Promise<void>;
  dryRun(params: ProviderParams): Promise<DryRunResult>;
}
```

---

## 8. Parameter Resolution

### 8.1 Parameter Sources

Parameters are resolved in this order (later overrides earlier):

1. **Provider defaults** from `providers.yaml` (see §3.5.1)
2. **Profile params** from `profiles.yaml` (see §3.5.2)
3. **Default values** from `schema.edn`
4. **User-supplied values** from the command invocation

### 8.2 Profiles

Profiles allow parameter sets to be reused across environments. They are defined in
`profiles.yaml` and select one provider per category plus application-specific params:

```yaml
# profiles.yaml
production:
  profile: "production"
  providers:
    smtp: resend
    dns: cloudflare
    backend: r2
    compute: oci
  params:
    domain: "app.example.com"
    package: "production"
    once:
      applications:
        - host: "www.app.example.com"
          image: "ghcr.io/bigconfig-ai/app:latest"
```

A package may define multiple named profiles. The user selects a profile at invocation time:

```sh
bb once create --profile production
npx bigconfig-once create --profile production
bigconfig-once create --profile production
```

### 8.3 Resolution Algorithm

When a profile is selected, the following resolution occurs:

```
1. Read profile from profiles.yaml
2. For each provider category in the profile:
   a. Look up provider params from providers.yaml
   b. Merge deploy-level params (e.g., SSH keys)
3. Merge profile's application-specific params on top
4. Override with user-supplied CLI values
5. Fill remaining defaults from schema.edn
6. Validate the complete parameter set against schema.edn
```

This ensures the same options produce identical behavior across all language
implementations.

---

## 9. Cross-Language Package Consumption

Users consume BigConfig packages through their native package manager:

### 9.1 Clojure (Babashka)

```clojure
;; bb.edn
{:deps {io.github.bigconfig-ai/once {:git/sha "<sha>"}}
 :tasks
 {:requires ([io.github.bigconfig-ai.once.package :as pkg])
  once {:doc "bb once create | bb once delete"
        :task (pkg/once* *command-line-args* opts)}}}
```

### 9.2 TypeScript (npm)

```bash
npm install @bigconfig/once
npx bigconfig-once create --domain example.com --provider-compute oci
```

Or programmatically:

```typescript
import { Once } from "@bigconfig/once";

const once = new Once({
  domain: "example.com",
  providerCompute: "oci",
});

await once.validate();
await once.create();
```

### 9.3 Python (PyPI)

```bash
pip install bigconfig-once
bigconfig-once create --domain example.com --provider-compute oci
```

Or programmatically:

```python
from bigconfig_once import Once

once = Once(domain="example.com", provider_compute="oci")
once.validate()
once.create()
```

---

## 10. Agentic DevOps Interface

BigConfig packages are designed to be operated by AI agents. Every command produces machine-readable output (JSON) and structured error messages.

### 10.1 Agent Workflow

```
1. Agent reads the package manifest and schema
2. Agent collects parameter values from the user (natural language → structured params)
3. Agent runs validate
4. If validate passes, agent runs create
5. Agent reports the result to the user
```

### 10.2 Error Recovery

When validation or creation fails, the response includes:

1. The specific check that failed
2. The expected vs. actual value
3. A remediation hint

---

## 11. Implementation Status

| Language | Status | Repository |
|---|---|---|
| **Clojure** | ✅ Production — works end-to-end | `bigconfig-ai/big-config` |
| **TypeScript** | 🔄 Planned — next target | — |
| **Python** | 📋 Future — after TypeScript | — |

---

## 12. Versioning

The **BigConfig Package Specification** follows SemVer:

- **Major**: Breaking changes to the package structure, schema format, or validation contract
- **Minor**: Additions of new template engines, providers, or lifecycle commands
- **Patch**: Clarifications, corrections, non-breaking refinements

Package manifests must declare `"specVersion": "1"` for compatibility.

---

*This specification is a living document. Open an issue or PR at `bigconfig-ai/big-config` to propose changes.*
