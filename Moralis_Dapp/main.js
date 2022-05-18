console.log("Hello world");

// connect to Moralis server
const serverUrl = "https://fjymkahveb6s.usemoralis.com:2053/server";
const appId = "lpnVdJHFzCRbKneR0lF2FF6CmyPoPPxXWgitrCI2";
Moralis.start({ serverUrl, appId });
let homepage = "http://127.0.0.1:5500/index.html"
if (Moralis.User.current() == null && window.location.href != homepage) {
    document.querySelector('body').style.display = 'none';
    window.location.href = "index.html";
}
login = async () => {
    await Moralis.authenticate().then(async function (user) {
        console.log('Logged in !')
        user.set("Name", document.getElementById('user-username').value);
        user.set("Email", document.getElementById('user-email').value);
        await user.save();
        window.location.href = "dashboard.html"
    })
}
logout = async () => {
    await Moralis.User.logOut();
    window.location.href = "index.html"

}
getTransactions = async () => {
    console.log('Transactions Clicked')
    const options = {
        chain: "rinkeby",
        address: "0xD6720e495F1B1011a079b21592CFf2e091e6cC46",
    };
    const transactions = await Moralis.Web3API.account.getTransactions(options);
    console.log(transactions)

    if (transactions.total > 0) {
        let table = `
          <table class="table">
          <thead>
          <tr>
            <th scope ="col">Transactions</th>
            <th scope ="col">Block</th>
            <th scope ="col">Age</th>
            <th scope ="col">Type</th>
            <th scope ="col">Fee</th>
            <th scope ="col">Value</th>
          </tr>
          </thead>
          <tbody id="theTransactions">
          </tbody>
        </table>
        `
        
        millisecondsToTime = (ms) => {
            let minutes = Math.floor(ms / (100 * 60));
            let hours = Math.floor(ms / (1000 * 60 * 60));
            let days = Math.floor(ms / (1000 * 60 * 60 * 24));

            if (days < 1) {
                if (hours < 1) {
                    if (minutes < 1) {
                        return `less than a minute ago`
                    } else return `${minutes} minutes(s) ago`
                } else return `${hours} hour(s) ago`
            } else return `${days} days(s) ago`

        }
        document.querySelector("#tableoftransactions").innerHTML = table;
        transactions.result.forEach(t => {
            let content = `
            <tr>
            <td><a href="https://rinkeby.etherscan.io/tx/${t.hash}" target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
            <td><a href="https://rinkeby.etherscan.io/block/${t.block_number}" target="_blank" rel="noopener noreferrer">${t.block_number}</td>
            <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.block_timestamp))}</td>
            <td>${t.from_address == Moralis.User.current().get('ethAddress') ? 'Ougoing' : 'Incoming'}</td>
            <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} ETH</td>
            <td>${(t.value / 1e18).toFixed(5)} ETH</td>
          </tr>`
            theTransactions.innerHTML += content;
        })
    }


}
getBalances = async () => {
    console.log("Get balances clicked");
    const ethbalance = await Moralis.Web3API.account.getNativeBalance({ chain: "rinkeby" });
    const ropstenbalance = await Moralis.Web3API.account.getNativeBalance({ chain: "ropsten" });
    const rinkebybalance = await Moralis.Web3API.account.getNativeBalance({ chain: "rinkeby" });
    console.log((ethbalance.balance / 1e18).toFixed(5) + "ETH");
    console.log((ropstenbalance.balance / 1e18).toFixed(5) + "ETH");
    console.log((rinkebybalance.balance / 1e18).toFixed(5) + "ETH");

    let content = document.querySelector('#userBalances').innerHTML = `
    <table class="table">
    <thead>
    <tr>
      <th scope ="col">Chain</th>
      <th scope ="col">Balance</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <tr>
            <th>Ether</th>
            <td>${(ethbalance.balance / 1e18).toFixed(5)} ETH</td>
        </tr>
        <tr>
            <th>Ropsten</th>
            <td>${(ropstenbalance.balance / 1e18).toFixed(5)} ETH</td>
        </tr>
        <tr>
            <th>Rinkeby</th>
            <td>${(rinkebybalance.balance / 1e18).toFixed(5)} ETH</td>
        </tr>
    </tr>
    </tbody>
  </table>            `
}
getNFTs = async () => {
    console.log('get nfts clicked');
    let nfts = await Moralis.Web3API.account.getNFTs({ chain: "rinkeby" })
    console.log(nfts)
    let tableofnfts= document.querySelector("#tableofnfts")
    if (nfts.result.length > 0) {
        nfts.result.forEach(n => {
            console.log(n)
            console.log(n.metadata)
            let metadata = JSON.parse(n.metadata)
            console.log(metadata)
             //console.log(n)
             console.log(metadata.image)
           // console.log(metadata.Name)
            // console.log(n.metadata.image)
            let content = `
            <div class="card col-md-3" >
            <img src="${(n.metadata.image)}" class="card-img-top">
            <div class="card-body">
                 <h5 class="card-title">${metadata.Name}</h5>
                 <p class="card-text">${metadata.description}</p>
            </div>
            </div>
            
            `
            tableofnfts.innerHTML+=content;
        })
    }

}
fixURl=(url)=>{
    if(url.startsWith("ipfs")){
        return "http://ipfs.moralis.io:2053/ipfs/" +url.split("ipfs://").slice(-1)
    }
    else{
        return url + "?format=json";
    }
}
if (document.querySelector('#btn-login') != null) {
    document.querySelector('#btn-login').onclick = login;
}
if (document.querySelector('#btn-logout') != null) {
    document.querySelector('#btn-logout').onclick = logout;
}
if (document.querySelector('#get-transactions-link') != null) {
    document.querySelector('#get-transactions-link').onclick = getTransactions;
}
if (document.querySelector('#get-balances-link') != null) {
    document.querySelector('#get-balances-link').onclick = getBalances;
}
if (document.querySelector('#get-nfts-link') != null) {
    document.querySelector('#get-nfts-link').onclick = getNFTs;
}

// get-transactions-link
// get-balances-link
// get-nfts-link