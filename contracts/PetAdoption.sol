// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PetAdoption {
    address public owner;
    address public shelterAddress;
    
    struct Pet {
        string name;
        uint256 adoptionFee;
        address adopter;
        bool isAdopted;
    }
    
    mapping(string => Pet) public pets;
    mapping(address => string[]) public adopterPets;
    
    event PetAdopted(address indexed adopter, string petId, uint256 amount);
    event ShelterRegistered(address indexed shelter);
    event PetFed(address indexed feeder, string petId, uint256 amount);
    event EthForwarded(address indexed shelter, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerShelter(address _shelterAddress) public onlyOwner {
        require(_shelterAddress != address(0), "Invalid shelter address");
        shelterAddress = _shelterAddress;
        emit ShelterRegistered(_shelterAddress);
    }
    
    function getShelterAddress() public view returns (address) {
        return shelterAddress;
    }
    
    function adoptPet(string memory petId) public payable {
        require(msg.value > 0, "Adoption fee must be greater than 0");
        require(shelterAddress != address(0), "Shelter not registered");
        require(!pets[petId].isAdopted, "Pet already adopted");
        
        // Record the adoption
        pets[petId] = Pet({
            name: petId,
            adoptionFee: msg.value,
            adopter: msg.sender,
            isAdopted: true
        });
        
        adopterPets[msg.sender].push(petId);
        
        // Forward ETH to shelter
        address payable shelter = payable(shelterAddress);
        (bool success, ) = shelter.call{value: msg.value}("");
        require(success, "Transfer to shelter failed");
        
        emit PetAdopted(msg.sender, petId, msg.value);
        emit EthForwarded(shelterAddress, msg.value);
    }
    
    function feedPet(string memory petId) public payable {
        require(msg.value > 0, "Feed amount must be greater than 0");
        require(shelterAddress != address(0), "Shelter not registered");
        require(pets[petId].isAdopted, "Pet not adopted yet");
        
        // Forward ETH to shelter
        address payable shelter = payable(shelterAddress);
        (bool success, ) = shelter.call{value: msg.value}("");
        require(success, "Transfer to shelter failed");
        
        emit PetFed(msg.sender, petId, msg.value);
        emit EthForwarded(shelterAddress, msg.value);
    }
    
    function getPetInfo(string memory petId) public view returns (string memory, uint256, address) {
        Pet memory pet = pets[petId];
        return (pet.name, pet.adoptionFee, pet.adopter);
    }
    
    function getAdopterPets(address adopter) public view returns (string[] memory) {
        return adopterPets[adopter];
    }
    
    // Emergency functions
    function updateShelter(address _newShelter) public onlyOwner {
        require(_newShelter != address(0), "Invalid shelter address");
        shelterAddress = _newShelter;
        emit ShelterRegistered(_newShelter);
    }
    
    // Fallback function to reject direct ETH transfers
    receive() external payable {
        revert("Direct transfers not allowed");
    }
}
