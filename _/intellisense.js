// bro, idk
import { languages } from "vscode";
languages.registerHoverProvider('quara', {
  provideHover(document, position, token) {
    return {
      contents: ['Hover Content']
    };
  }
});