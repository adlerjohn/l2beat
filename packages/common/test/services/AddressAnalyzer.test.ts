import { expect } from 'earljs'
import { providers } from 'ethers'
import {
  AddressAnalyzer,
  EthereumAddress,
  EtherscanClient,
  mock,
} from '../../src'

describe('AddressAnalyzer', () => {
  it('can detect an EOA', async () => {
    const provider = mock<providers.Provider>({
      getCode: async () => '0x',
    })
    const etherscanClient = mock<EtherscanClient>({
      getContractSource: async () => ({} as any),
    })
    const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
    const result = await addressAnalyzer.analyze(
      EthereumAddress('0x11223344556677889900aabbccddeeff11223344')
    )
    expect(result).toEqual({ type: 'EOA', name: '<EOA 11223344>' })
  })

  it('can detect an unverified contract', async () => {
    const provider = mock<providers.Provider>({
      getCode: async () => '0x112233',
    })
    const etherscanClient = mock<EtherscanClient>({
      getContractSource: async () =>
        ({ ABI: 'Contract source code not verified' } as any),
    })
    const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
    const result = await addressAnalyzer.analyze(
      EthereumAddress('0x11223344556677889900aabbccddeeff11223344')
    )
    expect(result).toEqual({
      type: 'Contract',
      verified: false,
      name: '<Unverified 11223344>',
    })
  })

  it('can detect a verified contract', async () => {
    const provider = mock<providers.Provider>({
      getCode: async () => '0x112233',
    })
    const etherscanClient = mock<EtherscanClient>({
      getContractSource: async () =>
        ({ ABI: '[{"type":"string"}]', ContractName: 'Foo' } as any),
    })
    const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
    const result = await addressAnalyzer.analyze(
      EthereumAddress('0x11223344556677889900aabbccddeeff11223344')
    )
    expect(result).toEqual({
      type: 'Contract',
      verified: true,
      name: 'Foo',
      abi: [{ type: 'string' }],
    })
  })
})
