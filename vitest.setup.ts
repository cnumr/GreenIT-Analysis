import { beforeAll } from 'vitest';
import { browser } from "wxt/browser"

beforeAll(() => {
  browser.i18n.getMessage = () => "test";
});
