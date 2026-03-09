import { defineConfig } from "vite"
import path from "path"
import fs from "fs"

export default defineConfig({

    build: {

        lib: {
            entry: path.resolve(__dirname, "src/index.js"),
            name: "AstroNatalChart",
            formats: ["es","umd"],
            fileName: (format) =>
                format === "es"
                    ? "astro-natal-chart.js"
                    : "astro-natal-chart.min.js"
        },

        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,

        rollupOptions: {
            output: {
                exports: "named"
            }
        }

    },

    plugins: [
        {
            name: "copy-to-docs",
            closeBundle() {

                const src = "dist/astro-natal-chart.js"   // ES build
                const dst = "docs/astro-natal-chart.js"

                if (fs.existsSync(src)) {
                    fs.copyFileSync(src, dst)
                }

            }
        }
    ]

})