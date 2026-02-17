---
name: zh-en-markdown-translator
description: Translates Chinese markdown files to English with specific path conventions and code block comment translation. Use when you need to create an English version of a Chinese markdown document in this repository.
---

# Zh En Markdown Translator

This skill provides a standardized workflow for translating Chinese markdown documents into English while adhering to repository-specific path conventions and preserving technical integrity.

## Workflow

### 1. Identify Target Path
Given an input file `/path/to/name.md`, the output path MUST be `/path/to/name/en.md`.
- Example: `src/about.md` -> `src/about/en.md`
- Example: `src/2024/10/my-post.md` -> `src/2024/10/my-post/en.md`

### 2. Translation Rules
- **Content**: Translate all Chinese text to natural, professional English.
- **Frontmatter**: If the markdown has YAML frontmatter, translate the values of keys like `title`, `description`, etc., while keeping the keys and structure intact.
- **Code Blocks**:
    - Keep the code structure and logic exactly as is.
    - **Translate Chinese comments** into English.
    - If a string literal contains Chinese that is meant for user display (e.g., `console.log("你好")`), translate it (e.g., `console.log("Hello")`).
    - Keep technical identifiers (variable names, function names) as is unless they are specifically in Chinese.
- **Links**: Update internal links to point to English versions if they exist.

### 3. Execution
1. Read the source markdown file.
2. Perform the translation following the rules above.
3. Write the translated content to the target path using `write_file` (which handles directory creation).

## Example
**Input (`src/test.md`):**
```markdown
---
title: 我的博客
---
# 欢迎
这是一个测试。
\```javascript
// 这是一个注释
console.log("你好");
\```
```

**Output (`src/test/en.md`):**
```markdown
---
title: My Blog
---
# Welcome
This is a test.
\```javascript
// This is a comment
console.log("Hello");
\```
```
