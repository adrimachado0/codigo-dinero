import { config } from "zod";

// The CSP has no 'unsafe-eval'. Zod 4 probes `Function("")` to enable its JIT, which the
// browser reports as a CSP violation (Lighthouse "inspector issues"). jitless skips the probe.
// Import this module before any schema parses in client code.
config({ jitless: true });
