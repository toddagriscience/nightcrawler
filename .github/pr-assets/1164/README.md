# Issue #1164 screenshots

`dialog-shift-before.png` and `dialog-shift-after.png` are 3x crops of the
marketing header's right edge on `/about` at 1440x900, captured in headless
Chrome from a local dev server. Each image stacks the dialog-closed state above
the dialog-open state; the red guide marks the right edge of the header text
while the dialog is closed. Before the fix the text moves 10px left of the
guide when the cookie dialog opens; after the fix it stays on it.
