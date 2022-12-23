# SIC/XE Assembler.js

### What is this?

This is a SIC/XE assembler written in JavaScript. It performs two passes over the input file, first to generate the symbol table and then to generate the object program. It also generates a solution file that contains the symbol table and the object program.

SIC-XE stands for Simplified Instructional Computer Extra Equipment, and is a hypothetical computer system. It is commonly used for instructional use and teaching, and is primarily used and talked about in the textbook, System Software: An Introduction to Systems Programming, by Leland Beck.

### How to run

1. Place all base input files in the ./input folder
2. Run the respective binary for the machine you are using (jsicvm-linux, jsicvm-mac, jsicvm-win.exe)
3. The output files will be in the ./output folder with the same name as the input file, but with \_sol for the solution file and \_obj for the object program file

### How to compile

1. Install Node.js (https://nodejs.org/en/)
2. Run `npm install` in the root folder
3. Run `npm run build` in the root folder
4. The binaries will be outputted
