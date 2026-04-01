---
name: security-audit
agent: ask
---

Perform a security audit of this codebase to detect any potential security vulnerabilities in this project.
Output your findings as a markdown formatted table with the following columns: "ID","Severity", "Issue",  "File path", "Line Number(s)", "Type", "Description", and "Recommendation".

Next, ask the user which issues they want to fix by either replying "all", or a comma-separated list of IDs. After their reply, run a separate sub agent (#runSubagent) to fix each issue that the user has specified. Each sub agent should report back with a simple `subAgentSuccess: true | false`,
