# SDD Toolkit Setup

This monorepo is configured to work with [spec-kit-command-cursor](https://github.com/madebyaris/spec-kit-command-cursor).

## Installation

### Option 1: Clone the Repository

```bash
# Clone spec-kit into .cursor directory
git clone https://github.com/madebyaris/spec-kit-command-cursor.git .cursor/spec-kit

# Or use a submodule
git submodule add https://github.com/madebyaris/spec-kit-command-cursor.git .cursor/spec-kit
```

### Option 2: Manual Setup

1. Clone or download the spec-kit repository
2. Copy the `.cursor/commands/` files to your `.cursor/commands/` directory
3. Copy the `.sdd/` template files to your `.sdd/templates/` directory

## Verification

After installation, verify the commands are available in Cursor:

1. Open Cursor IDE
2. Try typing `/brief` in the chat - it should autocomplete
3. Test with: `/brief test-feature Quick test feature`

## Configuration

The monorepo-specific guidelines are in `.sdd/guidelines.md` - this helps SDD commands understand:

- Available templates/apps
- Moon task patterns
- Code style conventions
- Testing expectations

## First Use

1. Read `docs-ai/sdd-workflow.md` for usage patterns
2. For most features, start with: `/brief feature-name Description`
3. For complex features, use full SDD: `/specify → /plan → /tasks → /implement`

## Integration with Business Context

Before using SDD commands:

1. Review `docs-ai/business-context.md` to understand verticals
2. Create a PRD using `docs-ai/prd-template.md` (optional but recommended)
3. Use SDD commands to generate technical specs
4. Reference `docs-ai/technical-guide.md` when implementing

## Troubleshooting

If commands don't appear:

1. Check that `.cursor/commands/` directory exists
2. Verify command files are present (`.cursor/commands/brief.md`, etc.)
3. Restart Cursor IDE
4. Check Cursor settings for command loading

For more details, see the [spec-kit-command-cursor repository](https://github.com/madebyaris/spec-kit-command-cursor).

