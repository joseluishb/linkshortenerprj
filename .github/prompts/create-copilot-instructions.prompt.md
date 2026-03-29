---
name: create-copilot-instructions
description: This prompt is used to generate instructions files for the /docs directory.
agent: Instructions Generator
---
Take the information below and generate a [NAME].instructions.md file for it in the /.github/instructions directory. Generate an appropiate name for the [NAME] placeholder based on the generated content. Make sure the instructions are concise and not too long. If no information is provided below, prompt the user to give the necessary details about the layer of architecture or coding standards to document.
The .md file should have frommatter with a description propertty that informs copilot of when to use thi set of instructions.