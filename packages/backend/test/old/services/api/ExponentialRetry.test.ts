import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earljs'

import { ExponentialRetry } from '../../../../src/old/services/api/ExponentialRetry'

describe('ExponentialRetry', () => {
  it('is transparent if call succeeds', async () => {
    const retry = new ExponentialRetry({
      startTimeout: 100,
      maxRetryCount: Infinity,
    })
    await retry.call(async () => 1)
  })

  it('will retry until successful', async () => {
    let callCount = 0
    let completed = false

    const retry = new ExponentialRetry({
      startTimeout: 100,
      maxRetryCount: Infinity,
    })

    const clock = FakeTimers.install()

    retry
      .call(async () => {
        callCount++
        if (callCount < 5) {
          throw new Error('Not yet!')
        }
        return 1
      })
      .then(() => {
        completed = true
      })

    await clock.runAllAsync()
    clock.uninstall()

    expect(clock.now).toEqual(100 + 200 + 400 + 800)
    expect(completed).toEqual(true)
    expect(callCount).toEqual(5)
  })

  it('will fail if not successful after maxRetryCount', async () => {
    let failed = false

    const retry = new ExponentialRetry({
      startTimeout: 100,
      maxRetryCount: 2,
    })

    const clock = FakeTimers.install()

    retry
      .call(async () => {
        throw new Error('Na-ah!')
      })
      .catch(() => {
        failed = true
      })

    await clock.runAllAsync()
    clock.uninstall()

    expect(clock.now).toEqual(100 + 200)
    expect(failed).toEqual(true)
  })
})
