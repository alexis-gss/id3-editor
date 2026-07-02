export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["source", "layer", "theme"],
      },
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes", "apply"],
      },
    ],
    "custom-property-no-missing-var-function": true,
    "declaration-property-value-no-unknown": null,
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme", "hsl"],
      },
    ],
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "order/properties-alphabetical-order": true,
    "import-notation": "string",
    "at-rule-descriptor-no-unknown": null,
  },
};