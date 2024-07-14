//import React from "react";
import ReactDOM from "react-dom/client";
import { modelInstance } from "./Model.ts";
import { ReactRoot } from "./ReactRoot.tsx";
import { observable, configure } from "mobx";

configure({ enforceActions: "never" }); 
const reactiveModel = observable(modelInstance);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(<ReactRoot model={reactiveModel} />); 

reactiveModel.ready = true;

reactiveModel.searchForGames();
reactiveModel.setCurrentGameId(null);
