import { expect } from 'earljs'

import { Bytes } from '../../src/model'

describe('Bytes', () => {
  describe('fromHex', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromHex('foo')).toThrow(TypeError)
      expect(() => Bytes.fromHex('0x123G')).toThrow(TypeError)
    })

    it('normalizes the input', () => {
      const bytes = Bytes.fromHex('0x123')
      expect(bytes.toString()).toEqual('0x0123')
    })
  })

  describe('fromByte', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromByte(1.5)).toThrow(TypeError)
      expect(() => Bytes.fromByte(-2)).toThrow(TypeError)
      expect(() => Bytes.fromByte(256)).toThrow(TypeError)
    })

    it('encodes 0 as 00', () => {
      const bytes = Bytes.fromByte(0)
      expect(bytes.toString()).toEqual('0x00')
    })

    it('encodes the byte', () => {
      const bytes = Bytes.fromByte(0xfa)
      expect(bytes.toString()).toEqual('0xfa')
    })
  })

  describe('fromNumber', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromNumber(1.5)).toThrow(TypeError)
      expect(() => Bytes.fromNumber(-2)).toThrow(TypeError)
    })

    it('encodes 0 as a empty', () => {
      const bytes = Bytes.fromNumber(0)
      expect(bytes.toString()).toEqual('0x')
    })

    it('encodes a number', () => {
      const bytes = Bytes.fromNumber(123456)
      expect(bytes.toString()).toEqual('0x01e240')
    })
  })

  describe('fromByteArray', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromByteArray([1.5])).toThrow(TypeError)
      expect(() => Bytes.fromByteArray([-2])).toThrow(TypeError)
      expect(() => Bytes.fromByteArray([256])).toThrow(TypeError)
    })

    it('concatenates encoded bytes', () => {
      const bytes = Bytes.fromByteArray([0, 1, 2, 3])
      expect(bytes.toString()).toEqual('0x00010203')
    })
  })

  describe('equals', () => {
    const first = Bytes.fromHex('56ab')
    const second = Bytes.fromHex('56AB')
    const third = Bytes.fromHex('1234')

    it('first == second', () => {
      expect(first.equals(second)).toEqual(true)
    })

    it('second == first', () => {
      expect(second.equals(first)).toEqual(true)
    })

    it('first != third', () => {
      expect(first.equals(third)).toEqual(false)
    })

    it('third != first', () => {
      expect(third.equals(first)).toEqual(false)
    })

    it('second != third', () => {
      expect(second.equals(third)).toEqual(false)
    })

    it('third != second', () => {
      expect(third.equals(second)).toEqual(false)
    })
  })

  describe('toByteArray', () => {
    it('encodes empty as []', () => {
      expect(Bytes.EMPTY.toByteArray()).toEqual([])
    })

    it('encodes bytes', () => {
      const bytes = Bytes.fromHex('abcd1234')
      expect(bytes.toByteArray()).toEqual([0xab, 0xcd, 0x12, 0x34])
    })
  })

  describe('toString', () => {
    it('encodes empty as "0x"', () => {
      expect(Bytes.EMPTY.toString()).toEqual('0x')
    })

    it('encodes bytes as normalized hex string', () => {
      const bytes = Bytes.fromHex('aBcD123')
      expect(bytes.toString()).toEqual('0x0abcd123')
    })
  })

  describe('toNumber', () => {
    it('treats empty as zero', () => {
      expect(Bytes.EMPTY.toNumber()).toEqual(0)
    })

    it('returns a number', () => {
      const bytes = Bytes.fromHex('00000123')
      expect(bytes.toNumber()).toEqual(291)
    })
  })

  describe('get', () => {
    it('throws when index is out of bounds', () => {
      const bytes = Bytes.fromHex('112233')
      expect(() => bytes.get(-1)).toThrow()
      expect(() => bytes.get(1.5)).toThrow()
      expect(() => bytes.get(3)).toThrow()
    })

    it('returns a specific byte', () => {
      const bytes = Bytes.fromHex('112233')
      expect(bytes.get(1)).toEqual(0x22)
    })
  })

  describe('length', () => {
    it('returns 0 for empty', () => {
      expect(Bytes.EMPTY.length).toEqual(0)
    })

    it('returns the number of bytes', () => {
      const bytes = Bytes.fromHex('112233')
      expect(bytes.length).toEqual(3)
    })
  })

  describe('slice', () => {
    it('returns a slice', () => {
      const bytes = Bytes.fromHex('123456abcd')
      expect(bytes.slice(1, 3)).toEqual(Bytes.fromHex('3456'))
    })
  })

  describe('concat', () => {
    it('concatenates bytes', () => {
      const first = Bytes.fromHex('1234')
      const second = Bytes.fromHex('5678')
      expect(first.concat(second)).toEqual(Bytes.fromHex('12345678'))
    })
  })
})
