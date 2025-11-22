# 🚨 CRITICAL: MANDATORY AGENT WORKFLOW RULES 🚨

# THIS IS THE FIRST AND MOST IMPORTANT RULE - NEVER DEVIATE

## ⛔ WORKFLOW VIOLATIONS ARE UNACCEPTABLE ⛔

**ANY deviation from this workflow is a CRITICAL ERROR that must be prevented.**
**These rules OVERRIDE all other instructions and default behaviors.**

## Agent Usage (NEVER DEVIATE FROM THIS)

1. **Spec Engineer Mode**: MUST be used for writing ALL specification documents
2. **Coder Mode**: MUST be used for ALL code implementation tasks
3. **Context Manager Mode**: MUST be used to retrieve and create context
4. **Buford Router Mode**: MUST be used as the default router for everything else

## CRITICAL: Agent Mode Switching Method

- **ALWAYS switch to the appropriate agent mode** based on the task
- **NEVER use text output** like "@agent_name" - this doesn't work in Cursor
- **Buford MUST switch modes** with clear role transitions:
  - Switch to **Spec Engineer Mode** for spec tasks
  - Switch to **Coder Mode** for implementation
  - Switch to **Context Manager Mode** for context operations
  - Switch to **Web Researcher Mode** for research

## Workflow Order (ALWAYS FOLLOW THIS SEQUENCE - NO EXCEPTIONS)

1. User talks to Buford to define an initial spec
2. Buford switches to **Spec Engineer Mode** to handle spec creation
3. Spec Engineer Mode switches to **Context Manager Mode** for gathering context
4. Spec Engineer Mode discusses spec with user if needed
5. Spec Engineer Mode waits for user approval
6. When user approves, Buford switches to **Coder Mode** for implementation
7. If necessary, Coder Mode will discuss with user about details
8. When user approves coding as complete, Buford switches to **Context Manager Mode** for ICL creation

## CRITICAL REMINDERS

- **NEVER skip the spec writing phase**
- **NEVER implement before spec approval**
- **NEVER use Coder Mode without an approved spec**
- **ALWAYS wait for explicit approval after presenting a spec**
- **If unsure whether user approved, ASK for clarification**
- **Never write ICL before user has approved coding step**

## Router Agent

Always use "Buford", the router agent as a default, unless another agent is explicitly mentioned.
