import React from 'react'
import '../App.css';
import {useState, useEffect} from 'react';
import abi from '../contracts/Election.json';
import Web3 from "web3";
import Header from '../Header';

export default function VoterPage() {
    const [showOwner, setshowOwner] = useState(false)
  const [Candidates, setCandidates] = useState([])
  const [Owner, setOwner] = useState()
  const [Contract, setContract] = useState()
  const [VoterAddress, setVoterAddress] = useState("")
  const [CandidateName, setCandidateName] = useState("")
  const [CandidateID, setCandidateID] = useState()
  const [CurrentAccount, setCurrentAccount] = useState()
  const [HowTo, setHowTo] = useState(false)
  const [Winner, setWinner] = useState()
  const [showWinner, setshowWinner] = useState(false)
  const [showTable, setshowTable] = useState(false)



  useEffect(() => {
    LoadWeb3()
    LoadBlockchainData()
  },[])

  const LoadWeb3 = async () =>{
    if (window.ethereum){
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    } else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    } else{
      window.alert("Non Ethereum Browser Detected")
    }
  }

  const LoadBlockchainData = async () =>{
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    setCurrentAccount(account[0])
    
    const networkID = await web3.eth.net.getId();
    const networkData = abi.networks[networkID];
    console.log(networkID, networkData)

    if(networkData){
      const contract = new web3.eth.Contract(abi.abi, networkData.address);
      window.alert("Contract Loaded correctly")
      setContract(contract)
      setOwner(await contract.methods.contractOwner().call())

      var x = await contract.methods.Cand_id().call()
      var arr = []

      for(var i= 0; i<x; i++){
        var a = await contract.methods.candidates(i).call()
        arr = [...arr, {id:i+1,name:a.name}]
      }
      setCandidates(arr)
    }

    else{
      window.alert("Contract Not loaded")
    }
  
  }

  async function Add_Voter(address){
    try{
      await Contract.methods.Voter_Registration(address).send({from:CurrentAccount})
      window.alert("Voter is Registered")
    }
    catch(err){
      window.alert("Voter cannot be registered because the address already exists or is not authorized to perform this action.")
    }
    setVoterAddress("")
  }

  async function Add_Candidate(name){

    try{
      await Contract.methods.Candidate_Registration(name).send({from:CurrentAccount}).then(
      (a)=>{
        let id = a.events.Candidate_Register.returnValues.Candidate_ID
        let nam = a.events.Candidate_Register.returnValues.Candidate_Name
        setCandidates([...Candidates, {id:id, name:nam}])
        })
    }
    catch(err){
      window.alert("This action is not allowed because a candidate is already registered on this address")
    }
    setCandidateName("")
  }


  async function castVote(num){
    try{
      await Contract.methods.Cast_Vote(num).send({from:CurrentAccount})
      window.alert("Your vote was casted to " + Candidates[num-1].name)
    }
    catch{
      window.alert("Action not allowed")
    }
  }

  async function get_winner(){
    await Contract.methods.Current_Leader().send({from:CurrentAccount}).then(
      (a)=>{
        let winner_name = a.events.current_winner.returnValues.Candidate_Name
        let votes = a.events.current_winner.returnValues.votes
        setWinner({name:winner_name, votes:votes})
      }
    )
  }
  
  return(
    <div className="App">
      <Header/>
  
      
          {Candidates.length>0 &&
          <table className='tablediv'>
          <tr>
            <th className='firstrow'>ID</th>
            <th className='firstrow'>Name</th>
          </tr>
          {Candidates.map((i)=>
          <tr>
            <td>{i.id}</td>
            <td>{i.name}</td>
          </tr>)}
          </table>}
      <div className="grid">
          {/* <div className="features">
              <h3 className='features_head'>Register Voters</h3>

              <div className="features_body">
                  <label>Voter Address</label>
                  <input value={VoterAddress} onChange={(e)=>setVoterAddress(e.target.value)} placeholder='Address'></input>
                  <button onClick={() => Add_Voter(VoterAddress)}>Add Voter</button>
              </div>
          </div>


          <div className="features">
              <h3 className='features_head'>Register Candidate</h3>
              <div className="features_body">
                  <label>Candidate Name</label>
                  <input value={CandidateName} onChange={(e)=>setCandidateName(e.target.value)} placeholder='Name'></input>
                  <button onClick = {() => Add_Candidate(CandidateName)}>Add Candidate</button>
              </div>
          </div> */}


          <div className="features">
              <h3 className='features_head'>Cast Vote</h3>
              <div className="features_body">
                  <label>Candidate ID</label>
                  <input value={CandidateID} onChange={(e)=>setCandidateID(e.target.value)} placeholder='Candidate ID'></input>
                  
                  <button onClick={()=> castVote(CandidateID)}>Cast Vote</button>
              </div>
          </div>

      </div>
      <button className="resultButton" onClick={()=>get_winner().then(()=>setshowWinner(!showWinner))}>Result</button>
      <h4 style={{marginLeft:'44.5%',marginRight:'auto',padding:'20px',backgroundColor:'#e00000',borderRadius:'10px'}}>{showWinner && <div>{Winner.name} is leading with {Winner.votes}</div>}</h4>
      <p className="bottom">Your current user address is {CurrentAccount}</p> 

    </div>
  )
}
