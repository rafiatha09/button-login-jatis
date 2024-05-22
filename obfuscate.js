// const fs = require('fs');
// const JavaScriptObfuscator = require('javascript-obfuscator');
import fs from "fs"
import JavaScriptObfuscator from 'javascript-obfuscator'

// Read the original code from auth.js
const originalCode = fs.readFileSync('index.js', 'utf8');

// Obfuscate the code
const obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,  // Protects the code from debugging
    disableConsoleOutput: false, // Biar ga ada console
    rotateStringArray: true
}).getObfuscatedCode();

// Write the obfuscated code to a new file
fs.writeFileSync('auth-jatis.js', obfuscatedCode);

console.log('Obfuscation complete.');
