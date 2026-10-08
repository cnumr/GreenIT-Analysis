import type { BrowserContext } from "@playwright/test";

/**
 * Crée une page Playwright configurée pour capturer toutes les requêtes et réponses HTTP.
 *
 * Cette fonction est nécessaire pour collecter les données réseau (format HAR) pendant la navigation
 * sur la page testée. Ces données sont ensuite utilisées par createDevToolsMocksScript pour simuler
 * l'API getHAR() des DevTools, permettant à l'extension d'accéder aux informations de performance
 * et de taille des ressources pendant les tests e2e (et donc in-fine, de permettre le calcul des métriques de l'extension GreenIT).
 *
 * @param context - Contexte de navigateur Playwright pour créer la page
 * @param harEntries - Tableau qui sera rempli avec les entrées HAR capturées
 * @returns La page Playwright configurée avec les listeners de requêtes/réponses
 */
async function createTestPage(context: BrowserContext, harEntries: any[]) {
  const testPage = await context.newPage();

  testPage.on("request", (request) => {
    harEntries.push({
      request: {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
      },
      response: null,
    });
  });

  testPage.on("response", async (response) => {
    const entry = harEntries.findLast((e) => e.request.url === response.url());
    if (entry) {
      const headers = response.headers();
      entry.response = {
        status: response.status(),
        statusText: response.statusText(),
        httpVersion: "HTTP/1.1",
        headers: headers,
        content: {
          size: (await response.body()).length,
          mimeType: headers["content-type"] || "",
        },
        bodySize: (await response.body()).length,
        _transferSize:
          (await response.body()).length + JSON.stringify(headers).length,
        headersSize: JSON.stringify(headers).length,
      };
    }
  });

  return testPage;
}

/**
 * Crée un script d'initialisation qui mock les API DevTools du navigateur.
 *
 * Cette fonction est nécessaire car les tests e2e exécutent l'extension dans un contexte
 * Playwright où les objets globaux spécifiques aux DevTools (browser.devtools.network,
 * browser.devtools.inspectedWindow, browser.runtime) ne sont pas disponibles.
 *
 * Le script généré simule ces API pour permettre à l'extension de fonctionner correctement
 * pendant les tests, en fournissant notamment :
 * - Un mock de getHAR() qui retourne les entrées HTTP capturées pendant le test
 * - Un mock de runtime.connect() pour la communication avec le background
 * - Un fallback avec une entrée HAR par défaut si aucune requête n'a été capturée
 *
 * @param harEntries - Tableau des entrées HAR capturées pendant la navigation
 * @param url - URL de la page testée
 * @returns Script JavaScript à injecter dans la page DevTools
 */
function createDevToolsMocksScript(harEntries: any[], url: string) {
  return `(
      function() {
        if (!window.browser) window.browser = {};
        if (!window.browser.devtools) window.browser.devtools = {};
        if (!window.browser.devtools.inspectedWindow) window.browser.devtools.inspectedWindow = {};
        if (!window.browser.devtools.network) window.browser.devtools.network = {};
        if (!window.browser.runtime) window.browser.runtime = {};

        window.browser.devtools.inspectedWindow.tabId = 1;
        window.browser.devtools.inspectedWindow.getResources = function(callback) {
          callback([]);
        };

        // Fix: Correct HAR format - just { entries: [...] }
        window.browser.devtools.network.getHAR = function(callback) {
          callback({
            entries: ${JSON.stringify(harEntries)}
          });
        };

        // Fix: Ensure entries.length > 0 to trigger refreshUI
        // Add a fallback entry if none captured
        const entries = ${JSON.stringify(harEntries)};
        if (entries.length === 0) {
          entries.push({
            request: { url: '${url}', method: 'GET' },
            response: {
              status: 200,
              statusText: 'OK',
              content: { size: 1000, mimeType: 'text/html' },
              bodySize: 1000,
              _transferSize: 1000,
              headersSize: 200
            }
          });
        }

        window.browser.runtime.connect = function(options) {
          const listeners = [];
          return {
            postMessage: function(msg) {
              if (msg.clearBrowserCache === false) {
                setTimeout(function() {
                  listeners.forEach(function(listener) {
                    listener({
                      analyseStartingTime: Date.now(),
                      url: '${url}',
                      domSize: 22,
                      nbRequest: entries.length,
                      responsesSize: entries.reduce((sum, e) => sum + (e.response?._transferSize || 0), 0),
                      responsesSizeUncompress: entries.reduce((sum, e) => sum + (e.response?.content?.size || 0), 0),
                      printStyleSheetsNumber: 0,
                      inlineStyleSheetsNumber: 0,
                      inlineJsScriptsNumber: 0,
                      inlineJsScript: '',
                      imagesResizedInBrowser: []
                    });
                  });
                }, 100);
              }
            },
            onMessage: {
              addListener: function(listener) { listeners.push(listener); }
            },
            onDisconnect: {
              addListener: function() {}
            }
          };
        };

        window.browser.runtime.getURL = function(path) {
          return 'chrome-extension://test' + path;
        };
        window.browser.runtime.id = 'test-extension';
      }
    )()`;
}

export async function openDevTools(
  url: string,
  context: BrowserContext,
  extensionId: string,
) {
  const harEntries: any[] = [];
  const testPage = await createTestPage(context, harEntries);
  await testPage.goto(url);
  await testPage.waitForLoadState("networkidle");

  // Ensure we have at least one entry (fallback for local files)
  if (harEntries.length === 0) {
    harEntries.push({
      request: { url: url, method: "GET", headers: {} },
      response: {
        status: 200,
        statusText: "OK",
        httpVersion: "HTTP/1.1",
        headers: {},
        content: { size: 1000, mimeType: "text/html" },
        bodySize: 1000,
        _transferSize: 1200,
        headersSize: 200,
      },
    });
  }

  // Open the DevTools Panel
  const devToolsPage = await context.newPage();

  await devToolsPage.addInitScript({
    content: createDevToolsMocksScript(harEntries, url),
  });

  await devToolsPage.goto(
    `chrome-extension://${extensionId}/devtools-panel.html`,
    { waitUntil: "domcontentloaded" },
  );
  await devToolsPage.waitForSelector("#launchAnalyse");

  return {
    triggerAnalysis: async () => {
      await devToolsPage.check("#analyseBestPracticesCheckBox");
      await devToolsPage.click("#launchAnalyse");

      // Increase timeout and add debug logging
      try {
        await devToolsPage.waitForSelector("#ecoIndexView:visible", {
          timeout: 30000,
        });
      } catch (error) {
        console.log("Current page content:", await devToolsPage.content());
        console.log("HAR entries captured:", harEntries.length);
        throw error;
      }

      return await devToolsPage.evaluate(() => {
        return {
          domSize: Number(document.getElementById("domSize")?.textContent),
          ecoIndex: Number(document.getElementById("ecoIndex")?.textContent),
          grade: document.getElementById("grade")?.textContent,
          requestNumber: Number(
            document.getElementById("requestNumber")?.textContent,
          ),
          responsesSize: document.getElementById("responsesSize")?.textContent,
          waterConsumption: Number(
            document.getElementById("waterConsumption")?.textContent,
          ),
          greenhouseGasesEmission: Number(
            document.getElementById("greenhouseGasesEmission")?.textContent,
          ),
        };
      });
    },
  };
}
