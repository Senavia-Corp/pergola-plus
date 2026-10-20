import { defineCliConfig } from 'sanity/cli';

// Proyecto y dataset del CLIENTE (organizacion otmn8ac33). No son secretos: el dataset
// `production` es publico (plan Free). Los tokens NUNCA van aqui: solo en variables de
// entorno de quien migra o despliega.
export default defineCliConfig({
  api: { projectId: 'n0ct9t3k', dataset: 'production' },
  studioHost: 'pergola-plus',
  // appId: la aplicacion del Studio desplegado (no es un secreto); evita que el deploy pregunte.
  deployment: { autoUpdates: false, appId: 'pcxo0syixugnmi6kffmqg5jn' },
});
