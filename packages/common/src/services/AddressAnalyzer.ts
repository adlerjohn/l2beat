import { providers } from 'ethers'

import { EthereumAddress, json } from '../model'
import { EtherscanClient } from '.'

export type AnalyzedAddress =
  | { type: 'EOA'; name: string }
  | { type: 'Contract'; verified: false; name: string }
  | { type: 'Contract'; verified: true; name: string; abi: json }

export class AddressAnalyzer {
  constructor(
    private provider: providers.Provider,
    private etherscanClient: EtherscanClient
  ) {}

  async getName(address: EthereumAddress) {
    const { name } = await this.analyze(address)
    return name
  }

  async analyze(address: EthereumAddress) {
    const [code, source] = await Promise.all([
      this.provider.getCode(address.toString()),
      this.etherscanClient.getContractSource(address),
    ])
    if (code === '0x') {
      return { type: 'EOA', name: `<EOA ${address.slice(2, 10)}>` }
    } else if (source.ABI === 'Contract source code not verified') {
      return {
        type: 'Contract',
        verified: false,
        name: `<Unverified ${address.slice(2, 10)}>`,
      }
    } else {
      return {
        type: 'Contract',
        verified: true,
        name: source.ContractName,
        abi: JSON.parse(source.ABI),
      }
    }
  }
}
