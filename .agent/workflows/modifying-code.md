---
description: When modifying existing code
---

1. Review related files before making changes to understand the context.
2. Preserve existing component and utility patterns.
3. Update corresponding tests in `.test.tsx` files when changing behavior.
4. Ensure `i18n` translation keys still match in `messages/en.json` and `messages/es.json`.
5. Maintain ARIA attributes and semantic HTML to verify accessibility.
6. Run full validation suite (`bun validate` inside `frontend`) before submitting.
