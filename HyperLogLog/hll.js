const crypto = require("crypto");

// Step 1: Hash function using SHA-256
function hash(input) {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 16); // Ensure 128-bit hex string
}

// Step 2: Initialize registers
const m = 16384; // Number of registers, should be a power of 2
const registers = new Array(m).fill(0);

// Step 3: Update registers
function updateRegisters(value) {
  const hashValue = hash(value);
  const binaryHash = parseInt(hashValue, 16).toString(2).padStart(64, "0"); // Convert to 64-bit binary string
  const j = parseInt(binaryHash.slice(0, Math.log2(m)), 2); // Determine register index
  const w = binaryHash.slice(Math.log2(m)); // Remaining part of the hash
  const leadingZeroes = w.indexOf("1") + 1; // Position of the first '1'
  registers[j] = Math.max(registers[j], leadingZeroes);

  // Debug log (optional)
  //console.log(`Value: ${value}, Hash: ${binaryHash}, Register: ${j}, Leading Zeroes: ${leadingZeroes}, Registers[${j}]: ${registers[j]}`);
}

// Step 4: Calculate raw estimate (harmonic mean)
function calculateRawEstimate() {
  let sum = 0;
  for (let i = 0; i < m; i++) {
    sum += Math.pow(2, -registers[i]);
  }
  return (1 / sum) * m * m;
}

// Step 5: Bias correction
const alphaM = 0.7213 / (1 + 1.079 / m);

function biasCorrection(rawEstimate) {
  return alphaM * rawEstimate;
}

// Step 6: Final estimate
function estimateCardinality() {
  const rawEstimate = calculateRawEstimate();
  return biasCorrection(rawEstimate);
}

// Test with large dataset
const largeData = Array.from({ length: 100000 }, (_, i) => `item${i}`);

largeData.forEach(item => updateRegisters(item));
console.log("Estimated Cardinality for Large Dataset:", estimateCardinality());

