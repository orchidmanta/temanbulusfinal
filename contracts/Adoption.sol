// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Adoption {
    struct Pet {
        address adopter;     // who adopted this pet
        uint256 balance;     // total ETH ever contributed
        string petId;        // unique pet id
        uint256 lastFedAt;   // last time fed (unix timestamp)
        address shelter;     // shelter wallet address
        bool active;         // active/inactive status
    }

    mapping(string => Pet) private pets; // petId => Pet struct
    address public owner;

    event PetAdopted(address indexed adopter, string petId, uint256 amount, address shelter);
    event PetFed(address indexed feeder, string petId, uint256 amount, address shelter);
    event FundsForwarded(string indexed petId, address indexed shelter, uint256 amount);
    event ShelterSet(string indexed petId, address indexed shelter);
    event Withdraw(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice set or update the shelter wallet for a pet id
    function setPetShelter(string calldata petId, address shelter) external onlyOwner {
        require(shelter != address(0), "invalid shelter");
        pets[petId].shelter = shelter;
        pets[petId].petId = petId; // ensure record exists
        pets[petId].active = true;
        emit ShelterSet(petId, shelter);
    }

    /// @notice adopt a pet; forwards ETH to shelter immediately
    function adoptPet(string calldata petId) external payable {
        require(msg.value > 0, "must send ETH");
        Pet storage p = pets[petId];
        require(p.active, "pet inactive");
        require(p.adopter == address(0), "already adopted");
        require(p.shelter != address(0), "shelter not set");

        p.adopter = msg.sender;
        p.balance += msg.value;
        p.lastFedAt = block.timestamp;

        // forward funds to shelter
        (bool sent, ) = payable(p.shelter).call{ value: msg.value }("");
        require(sent, "forward failed");

        emit FundsForwarded(p.petId, p.shelter, msg.value);
        emit PetAdopted(msg.sender, p.petId, msg.value, p.shelter);
    }

    /// @notice feed a pet; forwards ETH to shelter immediately
    function feedPet(string calldata petId) external payable {
        require(msg.value > 0, "must send ETH");
        Pet storage p = pets[petId];
        require(bytes(p.petId).length != 0 && p.active, "pet does not exist");
        require(p.shelter != address(0), "shelter not set");

        p.balance += msg.value;
        p.lastFedAt = block.timestamp;

        // forward funds to shelter
        (bool sent, ) = payable(p.shelter).call{ value: msg.value }("");
        require(sent, "forward failed");

        emit FundsForwarded(p.petId, p.shelter, msg.value);
        emit PetFed(msg.sender, p.petId, msg.value, p.shelter);
    }

    /// @notice get info about a pet
    function getPetInfo(string calldata petId) external view returns (
        string memory _petId,
        uint256 _balance,
        address _adopter,
        address _shelter,
        bool _active
    ) {
        Pet storage p = pets[petId];
        return (p.petId, p.balance, p.adopter, p.shelter, p.active);
    }

    /// @notice withdraw any leftover funds to owner (for dust or unexpected transfers)
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "no funds");
        (bool ok, ) = payable(owner).call{value: amount}("");
        require(ok, "transfer failed");
        emit Withdraw(owner, amount);
    }

    /// @notice fallback to accept ETH directly
    receive() external payable {}
}
