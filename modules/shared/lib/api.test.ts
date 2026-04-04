import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import axios from "axios"

describe("402 response interceptor", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // Mock window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function createTestApi() {
    const testApi = axios.create()
    testApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (typeof window !== "undefined") {
          if (error.response?.status === 402) {
            window.location.href = "/pricing"
            return new Promise(() => {})
          }
          if (error.response?.status === 401) {
            window.location.href = "/login"
          }
        }
        return Promise.reject(error)
      }
    )
    return testApi
  }

  it("redirects to /pricing on 402 response", () => {
    const testApi = createTestApi()
    const handlers = testApi.interceptors.response.handlers!

    const error402 = {
      response: { status: 402, data: {} },
      isAxiosError: true,
      toJSON: () => ({}),
    }

    // Fire the interceptor — it returns a pending promise and sets href synchronously
    handlers?.[0]?.rejected?.(error402)

    // Location should be set before the promise hangs
    expect(window.location.href).toBe("/pricing")
  })

  it("still handles 401 alongside 402", async () => {
    const testApi = createTestApi()
    const handlers = testApi.interceptors.response.handlers!

    const error401 = {
      response: { status: 401, data: {} },
      isAxiosError: true,
      toJSON: () => ({}),
    }

    await expect(
      handlers[0].rejected!(error401)
    ).rejects.toBeDefined()

    expect(window.location.href).toBe("/login")
  })

  it("does not redirect for other status codes", async () => {
    const testApi = createTestApi()
    const handlers = testApi.interceptors.response.handlers!

    const error500 = {
      response: { status: 500, data: {} },
      isAxiosError: true,
      toJSON: () => ({}),
    }

    await expect(
      handlers[0].rejected!(error500)
    ).rejects.toBeDefined()

    expect(window.location.href).toBe("")
  })
})
