import { resolve } from "node:path";
import { expect, test } from "./fixtures";
import { openDevTools } from "./openDevTools";

test("Should analyse test_page.html", async ({ context, extensionId }) => {
  const testPageUrl = `file://${resolve(import.meta.dirname, "./test_page.html")}`;
  const scenario = await openDevTools(testPageUrl, context, extensionId);

  const results = await scenario.triggerAnalysis();

  // should return 22 = 20 element + 2 svg images
  expect(results.domSize).toBe(22);
  expect(results.ecoIndex).toBeCloseTo(95.81, 0);
  expect(results.grade).toBe("A");
  expect(results.requestNumber).toBeGreaterThanOrEqual(6);
  expect(results.requestNumber).toBeLessThanOrEqual(7);
  expect(results.responsesSize).toBe("3 (3)");
  expect(results.waterConsumption).toBeCloseTo(1.63, 1);
  expect(results.greenhouseGasesEmission).toBeCloseTo(1.08, 1);
});
