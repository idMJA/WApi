await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	target: "bun",
	footer: "// Made by iaMJ / アーリャ",
});
