import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  FundsForwarded,
  PetAdopted,
  PetFed,
  ShelterSet,
  Withdraw
} from "../generated/Adoption/Adoption"

export function createFundsForwardedEvent(
  petId: string,
  shelter: Address,
  amount: BigInt
): FundsForwarded {
  let fundsForwardedEvent = changetype<FundsForwarded>(newMockEvent())

  fundsForwardedEvent.parameters = new Array()

  fundsForwardedEvent.parameters.push(
    new ethereum.EventParam("petId", ethereum.Value.fromString(petId))
  )
  fundsForwardedEvent.parameters.push(
    new ethereum.EventParam("shelter", ethereum.Value.fromAddress(shelter))
  )
  fundsForwardedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return fundsForwardedEvent
}

export function createPetAdoptedEvent(
  adopter: Address,
  petId: string,
  amount: BigInt,
  shelter: Address
): PetAdopted {
  let petAdoptedEvent = changetype<PetAdopted>(newMockEvent())

  petAdoptedEvent.parameters = new Array()

  petAdoptedEvent.parameters.push(
    new ethereum.EventParam("adopter", ethereum.Value.fromAddress(adopter))
  )
  petAdoptedEvent.parameters.push(
    new ethereum.EventParam("petId", ethereum.Value.fromString(petId))
  )
  petAdoptedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  petAdoptedEvent.parameters.push(
    new ethereum.EventParam("shelter", ethereum.Value.fromAddress(shelter))
  )

  return petAdoptedEvent
}

export function createPetFedEvent(
  feeder: Address,
  petId: string,
  amount: BigInt,
  shelter: Address
): PetFed {
  let petFedEvent = changetype<PetFed>(newMockEvent())

  petFedEvent.parameters = new Array()

  petFedEvent.parameters.push(
    new ethereum.EventParam("feeder", ethereum.Value.fromAddress(feeder))
  )
  petFedEvent.parameters.push(
    new ethereum.EventParam("petId", ethereum.Value.fromString(petId))
  )
  petFedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  petFedEvent.parameters.push(
    new ethereum.EventParam("shelter", ethereum.Value.fromAddress(shelter))
  )

  return petFedEvent
}

export function createShelterSetEvent(
  petId: string,
  shelter: Address
): ShelterSet {
  let shelterSetEvent = changetype<ShelterSet>(newMockEvent())

  shelterSetEvent.parameters = new Array()

  shelterSetEvent.parameters.push(
    new ethereum.EventParam("petId", ethereum.Value.fromString(petId))
  )
  shelterSetEvent.parameters.push(
    new ethereum.EventParam("shelter", ethereum.Value.fromAddress(shelter))
  )

  return shelterSetEvent
}

export function createWithdrawEvent(owner: Address, amount: BigInt): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawEvent
}
