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
        millisecondsToTime=(ms)=>{
            let minutes=Math.floor(ms/(100*60));
            let hours=Math.floor(ms/(1000*60*60));
            let days=Math.floor(ms/(1000*60*60*24));
    
            if(days<1){
                if(hours<1){
                    if(minutes<1){
                        return `less than a minute ago`
                    }else return`${minutes} minutes(s) ago`
                } else return `${hours} hour(s) ago`
            } else return`${days} days(s) ago`
    
        }
        document.querySelector("#tableoftransactions").innerHTML=table;
        transactions.result.forEach(t=>{
            let content=`
            <tr>
            <td><a href="https://rinkeby.etherscan.io/tx/${t.hash}" target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
            <td><a href="https://rinkeby.etherscan.io/block/${t.block_number}" target="_blank" rel="noopener noreferrer">${t.block_number}</td>
            <td>${millisecondsToTime(Date.parse(new Date()) - Date.parse(t.block_timestamp))}</td>
            <td>${t.from_address== Moralis.User.current().get('ethAddress') ? 'Ougoing': 'Incoming'}</td>
            <td>${((t.gas *t.gas_price)/1e18).toFixed(5)} ETH</td>
            <td>${(t.value/1e18).toFixed(5)} ETH</td>
          </tr>`
          theTransactions.innerHTML +=content;
        })
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

// get-transactions-link
// get-balances-link
// get-nfts-link