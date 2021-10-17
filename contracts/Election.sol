
pragma solidity ^0.5.16;

contract Election{
    event Candidate_Register(uint Candidate_ID, string  Candidate_Name);
    event current_winner(string Candidate_Name, uint votes);
    

    struct Candidate{
        string name;
        uint votes;
    }
    
    
    address public contractOwner = msg.sender;
    mapping(address => bool) public VoterList;
    mapping(address => bool) public Candidate_Exists;
    mapping(address => bool) public Votes_Casted;
    Candidate[] public candidates;
    uint public Cand_id = 0;
    
    // A constraint to Check if the Contract Owner is Invoking the function
    modifier onlyOwner(address add){
        require(add==contractOwner, "Account not authorized to perform this action");
        _;
    }
    
    //A constraint to only register one account only once
    modifier alreadyRegisteredVoter(address add){
        require(VoterList[add] == false, "The Voter is already Registered");
        _;
    }
    
    //Check if the candidate exists
    modifier alreadyRegisteredCandidate(address add){
        require(Candidate_Exists[add] == false, "The candidate is already Registered");
        _;
    }
    
    
    
    // A constraint to prevent double Voting
    modifier AlreadyVoted(address add){
        require(VoterList[add] == true, "Vote has already been casted");
        _;
    }
    
    
    
    // Registration of Voters. Can be done only by contract Owner
    
    function Voter_Registration(address given_address) public onlyOwner(msg.sender) alreadyRegisteredVoter(given_address){
        VoterList[given_address] = true;
    }
    
    
    
    
    // Registration of Candidates. Self registration, can be done by anyone.
    
    function Candidate_Registration(string memory Name) public alreadyRegisteredCandidate(msg.sender){
        candidates.push(Candidate(Name, 0));
        Cand_id++;
        Candidate_Exists[msg.sender] = true;
        emit Candidate_Register(Cand_id, Name);
    }



    // Cast Vote, can be invoked by voters.
    
    function Cast_Vote(uint Vote) public AlreadyVoted(msg.sender){
        candidates[Vote-1].votes++;
        VoterList[msg.sender] = false;
    }
    
    
    
    // Current Winners
    
    function Current_Leader() public{
        uint max_votes = 0;
        string memory winner = "";
        for(uint i=0; i<candidates.length;i++){
            if (candidates[i].votes > max_votes){
                max_votes = candidates[i].votes;
                winner = candidates[i].name;
            }
        }
        
        emit current_winner(winner, max_votes);
    }
    
}