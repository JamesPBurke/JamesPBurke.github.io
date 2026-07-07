---
permalink: /identity/instructions/
title: "How to Verify My Identity with PGP"
description: Step-by-step instructions for verifying James Patrick Burke's PGP-signed identity statement.
---

The claims on my [identity page](/identity/) — name, key fingerprint, and verified accounts — are backed by a PGP-signed statement, not just plain text anyone could edit. Here's how to check it yourself.

**1. Get my public key.** Either [download it](/verify/james-patrick-burke-public.asc), pull it straight from the keyserver:

```bash
gpg --keyserver keys.openpgp.org --recv-keys 1C0657927C3EE4DD6638C17D016CD7014FCDB4C9
```

or view it on [Keyoxide](https://keyoxide.org/1C0657927C3EE4DD6638C17D016CD7014FCDB4C9), which resolves the same key and shows its verified identity proofs.

If you downloaded the file instead: `gpg --import james-patrick-burke-public.asc`

**2. Download the signed statement:** [identity-statement.txt.asc](/verify/identity-statement.txt.asc) — a signed snapshot of my identity claims (name, fingerprint, verified accounts).

**3. Verify it:**

```bash
gpg --verify identity-statement.txt.asc
```

A valid result shows **"Good signature from James Patrick Burke"** and a fingerprint matching the one on my [identity page](/identity/), exactly. If the fingerprint doesn't match, or GPG reports a bad signature, don't trust the statement — reach out through one of the other verified channels instead.

**Using Kleopatra (Windows GUI)** instead of the command line: import the public key file via **File → Import Certificates**, then right-click `identity-statement.txt.asc` → **More GpgEX options → Verify**.
