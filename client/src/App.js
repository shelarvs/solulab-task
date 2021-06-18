import React, { Component } from "react";
import { Button} from 'react-bootstrap';

import SimpleStorageContract from "./contracts/offering.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
			coins: 0,
			recharge: 0,
			myBalance: 0,
			owner: 0, 
			saleNameData: "", 
			myaddress: 0, 
			buyToken: 0, 
			tokenName: 0, 
			tokenSymbol: 0, 
			web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
	  this.setState({ web3, accounts, contract: instance }, this.getMyAddress);
	  
	  
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const tokenNameData = await contract.methods.name().call();
	const tokenSymbolData = await contract.methods.symbol().call();
	const ownerAddress = await contract.methods.owner().call();
	const saleData = await contract.methods.saleName().call();
	var myWalletBalance = await contract.methods.myWalletBalance().call();
	myWalletBalance = (myWalletBalance) / 1000000000000000000;
	
	var myCoins = await contract.methods.balanceOf(accounts[0]).call();
	//removing Decimal zeros
	myCoins = myCoins/1000000000000000000;

    // Update state with the result.
    this.setState({ tokenName: tokenNameData });
	this.setState({ tokenSymbol: tokenSymbolData });
	this.setState({ owner: ownerAddress });
	this.setState({ saleNameData: saleData });
	this.setState({ myBalance: myWalletBalance });
	this.setState({ coins: myCoins });
  };
	
	getMyAddress = async () => {
    const { accounts, contract } = this.state;

    // Update state with the result.
    this.setState({ myaddress: accounts[0] });

  };
  
  myChangeHandler = (event) => {
    this.setState({buyToken: event.target.value});
  }
    myRechargeAmount = (event) => {
    this.setState({recharge: event.target.value});
  }
  

	//start Pre sale
	startPreSale = async () =>{
		const { accounts, contract } = this.state;
		await contract.methods.startPreSale().send({ from: accounts[0] });
		window.location.reload();
	}
	
		//start Final sale
	startSale = async () =>{
		const { accounts, contract } = this.state;
		await contract.methods.startSale().send({ from: accounts[0] });
		window.location.reload();
	}
	
		//Stop Final sale
	closeSale = async () =>{
		const { accounts, contract } = this.state;
		await contract.methods.stopSale().send({ from: accounts[0] });
		window.location.reload();
	}
	
	//Recharge My Account
	rechargeWallet = async () =>{
		const { accounts, contract } = this.state;
		//alert(this.state.recharge);
		await contract.methods.rechargeMyWallet(this.state.recharge).send({ from: accounts[0] });
		window.location.reload();
	}
	
		//BuyCoins Contract Function
		buyCoins = async () =>{
			const { accounts, contract } = this.state;
			await contract.methods.buyCoin(this.state.buyToken).send({ from: accounts[0] });
			 //alert(this.state.buyToken);
			var buyCoinCaught = contract.events.success({
			filter:{},
			fromBlock: 0
			}, function(error, event){})
					.on('data', function(event){
					console.log(event); // same results as the optional callback above
					window.location.reload();
			})
			.on('changed', function(event){
						// remove event from local database
			})        
			.on('error', function(error){
					console.log(error.message)    // remove event from local database
			});
		
		}
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
		<div className="sale-start">
		<div>
		  <h1 className="saleName"><code>{this.state.saleNameData}</code></h1>
		  <div><Button className="presale-btn" onClick={this.startPreSale}>Start PreSale</Button></div>
		</div>
		  <div className="sale-start-second">
		  <h1 className="saleName"></h1>
		  <div>
		  <Button className="sale-btn1" onClick={this.startSale}>Start Main Sale</Button>
		  <Button className="sale-btn2" onClick={this.closeSale}>Stop Main Sale</Button>
		  </div>
		 
		</div>
		</div>

	  
	  
	  <div className="account-info">
	  <h3 className="balance">MY BALANCE: {this.state.myBalance}</h3>
	  <h3 className="coin">My Coins: {this.state.coins}</h3>
	  <h2>Recharge Amount : 
			<input
			type='text'
			onChange={this.myRechargeAmount}
			/>
		</h2>
	  <Button className="recharge-btn" onClick={this.rechargeWallet}>Recharge</Button>
	  <p>Address: <strong>{this.state.myaddress}</strong></p>
	  <h1>Coin Name: {this.state.tokenName}</h1><h3>Coin Symbol: {this.state.tokenSymbol}</h3>
        
		
        <h2>Coins Quantity : 
			<input
			type='text'
			onChange={this.myChangeHandler}
			/>
		</h2>
		<div><Button className="buy-btn" onClick={this.buyCoins}>Buy Now</Button></div>
	   
	  </div>
	  
	 
        
        
      </div>
    );
  }
}

export default App;
