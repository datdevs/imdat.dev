import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import fetch from 'node-fetch';

const { Headers, Request, Response } = fetch;

if (!globalThis.fetch) {
  Object.assign(globalThis, {
    fetch: fetch as unknown as typeof globalThis.fetch,
    Headers: Headers as unknown as typeof globalThis.Headers,
    Request: Request as unknown as typeof globalThis.Request,
    Response: Response as unknown as typeof globalThis.Response,
  });
}

setupZoneTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
