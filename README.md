# Resume Parser

A Node.js application that extracts information from PDF resumes and saves the data to Excel files.

## Features

- Extract Name, Email, Phone, Skills, Education, and Experience from PDF resumes
- Generate structured Excel files with parsed data
- Support for multiple resume formats
- Enhanced parsing with improved regex patterns
- Dynamic file input support

## Installation

1. Clone the repository
2. Install dependencies:
   `ash
   npm install
   `

## Usage

### Parse a specific resume:
`ash
node parse_any_resume.js "filename.pdf"
`

### Parse the default sample resume:
`ash
node parse_any_resume.js
`

## Example

`ash
node parse_any_resume.js "resume.pdf"
`

This will create a file named parsed_resume.xlsx with the extracted information.

## Output

The script generates an Excel file with the following columns:
- Name
- Email  
- Phone
- Skills
- Education
- Experience

## Requirements

- Node.js
- PDF files to parse

## Dependencies

- pdf-parse: For PDF text extraction
- exceljs: For Excel file generation
- fs: For file system operations
- path: For file path handling
