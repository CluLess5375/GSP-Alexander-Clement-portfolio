    let urenAlexander = 12;
    let urenClement = 18;

    function laadPagina() {
        totaalUren();
        logboekEntries();
    }

    function totaalUren() {
        urenAlexander = parseInt(document.getElementById("urenAlexander").textContent);
        urenClement = parseInt(document.getElementById("urenClement").textContent);

        let totaal = urenAlexander + urenClement;

        document.getElementById("totaleUren-Dashboard").innerText = totaal + "u";
        document.getElementById("totaleUren-Dashboard-Card").innerText = totaal + "u";
        console.log("Totaal aantal uren: " + totaal);
    }

    function logboekEntries()
    {
        let entriesClement = document.querySelectorAll("#logboek-item-clement");
        let itemsClement = 0;
        let totaalAantalEntries = 0;

        entriesClement.forEach(() => {
            itemsClement++;
        });

        totaalAantalEntries = itemsClement;

        let entriesAlexander = document.querySelectorAll("#logboek-item-alexander");
        let itemsAlexander = 0;
        entriesAlexander.forEach(() => {
            itemsAlexander++;
        });

        totaalAantalEntries += itemsAlexander;


        document.getElementById("totaal-Aantal-Entries").innerText = totaalAantalEntries;
    
    document.getElementById("totaleUren-Dashboard").innerText = totaal + "u";
    document.getElementById("totaleUren-Dashboard-Card").innerText = totaal + "u";
    document.getElementById("totaleUren-Uren-Tracking").innerText = totaal + "u";
    console.log("Totaal aantal uren: " + totaal);
    }
