pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";  
contract offering is ERC20{
    
    address public owner;
    uint coinPrice;
    bool sale;
    uint public quantity;
    uint saleCount;
    string public saleName;

      event success(string);
    
        constructor (
            string memory _name,
            string memory _symbol,
            uint  _initial_supply
            
        )
        public
           
        ERC20(_name, _symbol)
        {
            _mint(msg.sender, _initial_supply );
            approve(msg.sender, _initial_supply);
            emit success("NFT Create successfully");
            owner = msg.sender;
            sale = false;
            coinPrice = 10000000000000000;
            quantity = 30000000000000000000000000;
            saleName = "Sale Not Started";
        }
        
        
            modifier checkOwner(){
                require (msg.sender == owner, "You are not owner");
                _;
            }
        
            modifier isSaleOn(){
                require (sale == true, "Sale Not Started");
                _;
            }

        mapping(address=>uint)balance;
        
        function startPreSale() public checkOwner{
            sale = true;
            saleName = "Pre-Sale";
        }
        
        function rechargeMyWallet(uint _amount)public{
        _amount = _amount * 1000000000000000000;
           balance[msg.sender] += _amount;
        }
        
        function myWalletBalance()public view returns(uint)
        {
            return balance[msg.sender];
        }
        
        function startSale() public checkOwner{
            uint supply = balanceOf(owner);
            require(supply>0,"End of Supply");
            saleName = "Final Sale";
            sale = true;
        }
        
        function stopSale() public checkOwner{
           
            saleName = "Sale is currently CLOSED";
            sale = false;
        }
        
        function buyCoin(uint _amount) public isSaleOn payable{
            require(balance[msg.sender]>0,"Low Balance");
            
            uint totalAmount = coinPrice * _amount;
            uint supply = balanceOf(owner);
            require(supply>0,"End of Supply");

                if(balance[msg.sender]<totalAmount)
                    {
                        emit success("Low Balance");
                    }
                else
                    {
                        approve(msg.sender, _amount); 
                    
                        //can transfer coins using ETH
                        //payable(owner).transfer(_amount);
                        
                        _transfer(owner,msg.sender,_amount);   
                        quantity = quantity - _amount;
                        balance[msg.sender] -=totalAmount;
                    }
                    
                if( quantity == 0)
                    {
                        quantity = 50000000000000000000000000;
                        saleCount=saleCount+1;
                        saleName = "Seed Sale";
                        coinPrice = 20000000000000000;
                        if(saleCount==2)
                        {
                            sale = false;
                            saleName = "Sale is currently CLOSED";
                        }
            
                    }

        }
    
}