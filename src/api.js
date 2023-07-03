

//--------------------------/
/*  programs?              */
/*  account formats?       */
/*  instruct encoding?     */
/*  key layouts?           */
/*  instruct generation?   */
/*  tx generation?         */
/*  data requests?         */
//--------------------------/


function api_Obj(){

  this.program = { //};

    system:   "11111111111111111111111111111111",
    token:    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    assoc:    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    metaplex: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    memo:     "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo", //

    record:   "ReciQBw6sQKH9TVVJQDnbnJ5W7FP539tPHjZhRF4E9r", 
    name:     "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX" }; //

  this.accountSize = { //};

    mint:  [82],
    token: [165],
    system:[0],   };

  this.layout = { 
 
    account: {
      offsets: [0,32,64,76,121],
      sizes:   [32,32,8,32,8],
      names:   ['mint', 'owner', 'amount', 'delegate','del_amount'], }, 

    mint: {
      offsets: [0,4,36,44],
      sizes:   [4,32,8,1],
      names:   ['mintable', 'mintAuth', 'supply', 'decimals'], }, 

    meta: {
      offsets: [1,33,65,115],
      sizes:   [32,32,36,204],
      names:   ['auth', 'mint', 'name', 'uri'], }, 
      

    };

  this.instruct = { //};

    source: [],
    dest:   [],
    owner:  [],
    program:     "",
    instruct_Id: "",
    data: []    };

  this.instruction_id = {

    a_token: {
      new_account: 1,
      nest_close:  2, },

    token: {
      new_mint :  0,
      transfer :  3,
      approve :   4,
      revoke :    5,
      authority : 6,
      mint_to :   7,
      burn :      8,
      close :     9,
      }
    };

  this.instruction_keys = {
    token:  {
      new_mint :  2,
      transfer :  3,
      approve :   3,
      revoke :    2,
      authority : 3,
      mint_to :   4,
      burn :      3,
      close :     3,
      },

    a_token:  {
      new_account: 6,
      nest_close:  7, }

    };
      

  this.instruction_datasize = {     /**  ?? */
    token:  {
      new_mint :  64+3,
      transfer :  9,
      approve :   9,
      revoke :    1,
      authority : 32+3,
      mint_to :   9,
      burn :      9,
      close :     1,
      },

    a_token: {
      new_account : 1,}

    };

  this.tx = { //
    instructions : []}
    

  this.rx =      {//};

    type :  "",
    key  :  "",
    filters: [ 
      'dataSize',
      'memcmp',
      'dataSlice']

    };   

  this.connection = {

    requests: [
      'getAccountInfo',
      'getBalance',
      'getProgramAccounts',
      'getTokenAccountsByOwner',
      'getTokenSupply',
      'getTransactions',
      'getSignaturesForAddress',
      'simulateTransaction',
      'sendTransaction',

    ]};

  this.param = {};
      //token

  this.web3 = { //};

    PublicKey:{
      isOnCurve:'',},
    SystemProgram:{
      transfer:''},

    TransactionInstruction:'',
    sendAndConfirmTransaction:'' }

  

  this.gen = function(x){

    var z = new Object(x);
    return z;}

  }

//---------------------------------------

function sol_obj(s){

  this.sol = s;

  this.api = new api_Obj();

  this.tx_info = function(p_id, inst){
    return [this.api.program[p_id], this.api.instruction_id.token[inst],
            this.api.instruction_keys.token[inst], this.api.instruction_datasize.token[inst] ];
    }

  this.k_write = function(key){
    return {pubKey: key, isWritable: true, isSigner: false};
    }

  this.k_sign = function(key){
    return {pubKey: key, isWritable: false, isSigner: true};
    }

  this.find_address = function(dest, mint){
    return this.sol.PublicKey.findProgramAddress([dest.toBuffer(), tokenkey.toBuffer(), mint.toBuffer()], ataId);
    }

  this.find_meta = function(mint){
    return this.sol.PublicKey.findProgramAddress(['metadata', metaplex.toBuffer(), mint.toBuffer()], metaplex);
    }

  this.s_pk = function(keyString){
    return new this.sol.PublicKey(keyString);
    }

  this.pk_s = function(pubkey){
    return pubkey.toBase58();  
    }

  this.access_p = "https://side-young-mountain.solana-mainnet.discover.quiknode.pro/cf23f5a294367ce0cf1b89a1a34d9c00039e069a/";

  this.con = null;

  this.con_Timeout = 180000; // (~ 3 minutes)

  this.connect = function(){
    if(this.con == null)
      this.con = new sol.sol.Connection(this.access_p, "confirmed");
    setTimeout(this.disconnect, this.con_Timeout);
    return this.con;
    }

  this.disconnect = function(){
    console.log("auto-disconnect");
    this.con = null;
    }

  this.tx = function(prog, inst, keys, amount=0, dec=9, memo=""){

    var d = this.tx_info(prog, inst);
    var xkeys = [];

    for (var i=0; i<d[2]-1; i++){
      xkeys.push(this.k_write(keys[i]));}

    xkeys.push(this.k_sign(keys[i]));

    var xdata = [];

    if(prog=='memo')
      xdata = Buffer.from(memo);

    if(d[3]==1) 
      xdata.push(d[1]);

    if(d[3]==9)
      xdata = bignumber_Encode(amount, dec, d[1]);

    if(d[3]==35)
      xdata = Auth_encoding(authType, newAuth, authKey);
      
    if(d[3]==67)
      xdata = Mint_encoding(mintAuth, freezeAuth, dec, enFreeze);

    var t = new this.sol.TransactionInstruction({keys: xkeys, data: xdata, programId: this.s_pk(d[0])});

    return t;
    }

  
  

  this.gen_tx = async function(tx=[], signers=[], status="confirmed"){

    var tx1 = new this.sol.Transaction();

    for (var i=0; i<tx.length; i++){

      tx1.add(tx[i]);}

    return tx1;

    }

  this.comp_tx = function(tx, fp){

    tx.feePayer = fp;

    this.connect();

    var bh = this.con.getRecentBlockhash();

    bh.then((x)=>tx.recentBlockhash=x);

    return tx;

    }



  this.make_tx = async function(tx=[], signers=[], status="confirmed"){

    var tx1 = new this.sol.Transaction();

    for (var i=0; i<tx.length; i++){

      await tx1.add(tx[i]);}

    var con = this.connect();

    var txres = await con.sendTransaction(tx1, signers, status);

    return txres;

    }

  };

//encoders

function bignumber_Encode(n, dec, i){ // [u8, u64]

  var x = n%1;

  var x2 = x * (10**dec);

  var n2 = (BigInt(n|0)* BigInt(10**dec)) + BigInt(x2|0);

//  console.log(n2);

  var k = BigInt(256);

  var j=0;

  var res = [];

  res[0] = i; // instruction Id

  j++;

  while(n2>0){

    res[j] =  Number(n2 % k); //Number();

    n2 = (n2 - BigInt(res[j])) / BigInt(256);

    j++;

    }

  while(j<9) res[j++] =0;

  console.log(res);

  return res;

  }


function Mint_encoding(k1, k2, dec, k2bool){ //? [u8,u8,k32,u8,k32]

  var ax = new Array(64+3);

  ax.fill(0);

  for (var i=0;i<32; i++){

    ax[i+2] = k1[i];

    if (k2bool) ax[i+32+3] = k2[i];

    }

  ax[0] = 0;

  ax[1] = dec;

  ax[34] = k2bool;

  return ax;

  }



function Auth_encoding(i2, i3, newAuth){ //? [u8,u8,u8,k32]

  var ax = new Array(32+3);

  ax.fill(0);
    
  if (i3==1){

    for (var i=0;i<32; i++){

      ax[i+3] = k1[i];

      }
      
    }

  ax[0] =  6; //i1; // setAuth instruction

  ax[1] = i2; // expect 0 or 2? (0-3)

  ax[2] = i3; // (0 or 1)

  return ax;

  }



