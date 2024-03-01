import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import graphql from "@rollup/plugin-graphql";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import dts from "rollup-plugin-dts";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      // {
      //   file: pkg.main,
      //   format: "cjs",
      //   sourcemap: true,
      // },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: true
      }
    ],
    external: [...Object.keys(pkg.devDependencies), /node_modules/],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      graphql(),
      json(),
      svgr(),
      postcss(
        {
          extract: false,
          modules: true
        })
    ]
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|graphql)$/]
  }
];