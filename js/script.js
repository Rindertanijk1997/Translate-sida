// Hämta referenser till DOM-element
const fromText = document.querySelector(".from-text"), // Referens till elementet för texten som översätts från
      toText = document.querySelector(".to-text"),     // Referens till elementet för texten som översätts till
      selectTag = document.querySelectorAll("select"), // Referenser till alla select-element
      exchangeIcon = document.querySelector(".exchange"), // Referens till ikonen för utbyte av språk
      translateBtn = document.querySelector("button"),    // Referens till knappen för översättning
      icons = document.querySelectorAll(".row i");         // Referenser till alla ikoner i raden

// Loopa igenom varje select-element
selectTag.forEach((tag, id) => {
    // Loopa igenom alla länder i countries-objektet
    for (const country_code in countries) {
       let selected;
       // Kontrollera om det är första select-elementet och landet är "sv-SE"
       if(id === 0 && country_code === "sv-SE") {
        selected = "selected";
       // Kontrollera om det är andra select-elementet och landet är "en-GB"
       } else if (id === 1 && country_code === "en-GB") {
        selected = "selected";
       }
       // Skapa HTML för varje option-element baserat på länderna och valda alternativ
       let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
       // Lägg till option-elementet i select-elementet
       tag.insertAdjacentHTML("beforeend", option);
    }
});

// Lyssnare för utbytesikonen
exchangeIcon.addEventListener("click", () =>{
    // Byt plats på texten som översätts från och till
    let tempText = fromText.value;
    tempLang = selectTag[0].value,
    fromText.value = toText.value;
    selectTag[0].value = selectTag[1].value;
    toText.value = tempText;
    selectTag[1].value = tempText;
});

// Lyssnare för översättningsknappen
translateBtn.addEventListener("click", () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    // Kontrollera om det finns text att översätta
    if(!text) return;
    // Visa meddelande medan översättning pågår
    toText.setAttribute("placeholder", "översätter...");
    // Anropa översättnings-API och uppdatera måltexten när svar erhålls
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "översättning");
    });
});

// Lyssnare för ikonerna
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        // Kopiafunktion för texten
        if(target.classList.contains("fa-copy")) {
            if(target.id === "from") {
               navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else{
            let utterance;
            // Taluttryck för texten
            if(target.id === "from") {
               utterance = new SpeechSynthesisUtterance(fromText.value);
               utterance.lang = selectTag[0].value;
             } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
             }
             speechSynthesis.speak(utterance);
        }
    });
})
