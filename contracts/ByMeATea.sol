//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//Deoployed to Goerli at 0x03CC76d822F798B19A13e72f24f26bb645f0B5d2

contract BuyMeATea {
    // Event to tmit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of all memos received from friends.
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    // Deploy logic.
    constructor() {
        owner = payable(msg.sender);
    }


    /**
    * @dev buy a tea for contract owner
    * @param _name name of the tea buyer
    * @param _message a nice message from the tea buyer
    */
    function buyTea(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "can't buy tea wtih 0 eth");

        // Add the memo to storage!
         memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
         ));

         // Emit a log event when a new memo is created!
         emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
         );
    }

    /**
    * @dev send the entire balance stored in this contracts to the owner
    */
    function withDrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
    * @dev retrive all the memos received and stored in this blockchain
    */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

}