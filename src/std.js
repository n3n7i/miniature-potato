

var sol = new sol_obj(solanaWeb3);


function token_transfer(s,d,o, amount, dec){

  return sol.tx('token', 'transfer', [s,d,o], amount, dec);
  }

function token_approve(s,d,o, amount, dec){

  return sol.tx('token', 'approve', [s,d,o], amount, dec);
  }

function token_revoke(s,o){

  return sol.tx('token', 'revoke', [s,o]);
  }


function token_mintTo(s,d,o,a, amount, dec){

  return sol.tx('token', 'mint_to', [s,d,o,a], amount, dec);
  }


function token_burn(s,o, amount, dec){

  return sol.tx('token', 'burn', [s,o], amount, dec);
  }


function token_close(s,d,o){

  return sol.tx('token', 'close', [s,d,o]);
  }


async function get_txSizes(){

  var a = sol.sol.PublicKey.unique();
  var b = sol.sol.PublicKey.unique();
  var c = sol.sol.PublicKey.unique();

  var d = sol.sol.Keypair.generate();

  var d2 = d.publicKey;


  var txlist = [];

  txlist.push(token_transfer(a,b,d2,1,0));
  txlist.push(token_approve(a,b,d2,1,0));
  txlist.push(token_revoke(a,d2));
//  txlist.push(token_mintTo(a,b,c,1,0));
//  txlist.push(token_burn(a,d2,1,0));
//  txlist.push(token_close(a,b,d2));

  var txn = await sol.gen_tx(txlist, []);

  return txlist;

  }

