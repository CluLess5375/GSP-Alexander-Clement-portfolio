let urenAlexander = 12;
let urenClement = 18;

function laadPagina() {
    totaalUren();
}

function totaalUren() {
    urenAlexander = parseInt(document.getElementById("urenAlexander").textContent);
    urenClement = parseInt(document.getElementById("urenClement").textContent);

    let totaal = urenAlexander + urenClement;

    document.getElementById("totaleUren-Dashboard").innerText = totaal + "u";
    document.getElementById("totaleUren-Dashboard-Card").innerText = totaal + "u";
    console.log("Totaal aantal uren: " + totaal);
}