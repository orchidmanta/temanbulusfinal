import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { FundsForwarded } from "../generated/schema"
import { FundsForwarded as FundsForwardedEvent } from "../generated/Adoption/Adoption"
import { handleFundsForwarded } from "../src/adoption"
import { createFundsForwardedEvent } from "./adoption-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let petId = "Example string value"
    let shelter = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let newFundsForwardedEvent = createFundsForwardedEvent(
      petId,
      shelter,
      amount
    )
    handleFundsForwarded(newFundsForwardedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("FundsForwarded created and stored", () => {
    assert.entityCount("FundsForwarded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FundsForwarded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "petId",
      "Example string value"
    )
    assert.fieldEquals(
      "FundsForwarded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "shelter",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FundsForwarded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
