<script>

var spanishResult;
var englishResult;

var displayIsEnglish;

var tone = "formal";
var format = "text";
var relationship = "friend";

function loadingText()
{
    //allow editing response!?
    var txt = "Generando " + format + " con tono " + tone + "..."; 
    return txt;
}

function goBack()
{
    history.back()
}

function copy()
{
var result = document.getElementById("output").innerHTML;
navigator.clipboard.writeText(result);
}

function share()
{
navigator.share({
text: "Genere este texto usando suenagringo :):\n\n' "+document.getElementById("output").innerHTML + " '",
url: 'https://suenagringo.carrd.co/'
})
}

function flipLanguage()
{
if (displayIsEnglish)
{
document.getElementById("output").innerHTML = spanishResult;
}
else
{
document.getElementById("output").innerHTML = englishResult;
}
displayIsEnglish = !displayIsEnglish;
}



async function translateGPT(englishResult)
{
console.log("******  translateGPT *********");
var inputPrompt ="You are a language translator. Translate the following INPUT to SPANISH\nINPUT:\n" + englishResult;
inputPrompt+="\n\nOUTPUT:\n";

console.log('sending prompt:')
console.log("'" + inputPrompt + "'")

jsonPrompt = JSON.stringify({ prompt: inputPrompt });

const options =
{
method: 'POST',
body: jsonPrompt,
headers: {
'Content-Type': 'application/json'
}
}

const response = await fetch(`https://wrappedgpt1.azurewebsites.net/api/azurefunctiongpt?promptType=freeform`, options);

if (!response.ok) {
const message = `An error has occured: ${response.status}`;
throw new Error(message);
}

spanishResult = await response.text();
console.log("server response: ");
console.log(spanishResult);

console.log("********** end translate GPT ************")
SetEndState();
}

function SetEndState()
{
    
//hide loading spinner only after everything is ready!
document.getElementById("spinner").style.display = "none";

//Display resuult
var element = document.getElementById("output");
element.innerHTML = englishResult;

//Show result buttons!
document.getElementById("doneMenu").style.opacity = "1";
document.getElementById("resultActions").style.opacity = '1'

copy();
}

function SetLoadingState()
{
//setup UI - hide result buttons
document.getElementById("doneMenu").style.opacity = '0'
document.getElementById("resultActions").style.opacity = '0'

//setup UI - show loading spinner
document.getElementById("spinner").style.display = "block";
document.getElementById("output").innerHTML = loadingText();

}

function loadInputValues()
{
    toneOption = document.getElementById("idVibra");
    if (toneOption)
    {
        tone = toneOption.value;
    }

    formatOption = document.getElementById("idFormatoSection");
    if (formatOption)
    {
        format = formatOption.value;
    }

    relationshipOption = document.getElementById("idRelationshipSection").value;
    if (relationshipOption)
    {
        relationship = relationshipOption.value;
    }
}

async function callGPT()
{
SetLoadingState();
loadInputValues();

console.log("*********  Start of callGPT ********* ")

//Give GPT the instructions
inputPrompt="Context: You are an AI designed to help rewrite INPUT text from SPANISH into ENGLISH. You never respond in SPANISH, always in ENGLISH.\n"
inputPrompt+= "Instructions: Create a " + tone + " " + format + " in ENGLISH addressed to my " + relationship + " based on the following INPUT text.";

//Give GPT the input text
inputPrompt+="\nINPUT:\n" + document.getElementById("inputTextArea").value;

//Prompt it for the output text
inputPrompt+="\n\nOUTPUT:\n";

console.log('sending prompt:')
console.log("'" + inputPrompt + "'")
jsonPrompt = JSON.stringify({ prompt: inputPrompt });

const options =
{
method: 'POST',
body: jsonPrompt,
headers: {
'Content-Type': 'application/json'
}
}

const response = await fetch(`https://wrappedgpt1.azurewebsites.net/api/azurefunctiongpt?promptType=freeform`, options);

if (!response.ok) {
const message = `An error has occured: ${response.status}`;
throw new Error(message);
}

englishResult = await response.text();
console.log("server response: ");
console.log(englishResult);

displayIsEnglish = true;
console.log("********* finished generating english text ********* ");

translateGPT(englishResult);
}
</script>