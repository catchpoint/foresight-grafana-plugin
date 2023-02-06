import { PanelPlugin } from "@grafana/data";
import { ForesightPanelConfig } from "./types";
import { ForesightPanel } from "./components/ForesightPanel";

export const plugin = new PanelPlugin<ForesightPanelConfig>(
     ForesightPanel
).setPanelOptions((builder) => {
     return builder
          .addTextInput({
               path: "apiKey",
               name: "Foresight Api Key",
               description: "Foresight Api Key",
               defaultValue: "",
          })
          .addTextInput({
               path: "basePath",
               name: "Foresight Api Path",
               description: "URL of the Foresight Api",
               defaultValue: "https://api.service.runforesight.com",
          });
});
