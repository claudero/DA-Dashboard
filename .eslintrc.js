module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "browser": true,
        "amd": true,
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "plugins": [
        "standard",
        "react",
        "promise",
        "jsx",
        "flowtype"
    ],
    "rules": {
        "no-debugger": "warn",
        "no-console": "off",
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "eqeqeq": "error",
        "dot-notation": "warn",
        "no-unused-vars": [
            "error",
            {"argsIgnorePattern": "^_"}
        ]
    },
    "settings": {
        "react": {
            "version": "0.13.0"
        }
    }
};