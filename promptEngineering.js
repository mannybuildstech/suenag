<script>

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

var spanishResult;
var englishResult;
var displayIsEnglish;

async function translateGPT(englishResult)
{
console.log("Start of translateGPT");
var inputPrompt ="You are a language translator. Translate the following INPUT to SPANISH\nINPUT:\n" + englishResult;
inputPrompt+="\n\nOUTPUT:\n";

console.log('sending prompt:')
console.log("'" + inputPrompt + "'")

jsonPrompt = JSON.stringify({ prompt: inputPrompt });

console.log('in JSON:')
console.log(jsonPrompt)

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

const data = await response.text();
console.log("server response: ");
console.log(data);

spanishResult = data;
document.getElementById("flipButton").style.opacity = '1'
}

async function callGPT()
{
console.log("STart of callGPT")
document.getElementById("flipButton").style.opacity = '0'
document.getElementById("resultActions").style.opacity = '0'
document.getElementById("responseContainer").style.display = "block";
var tone = document.getElementById("idVibra").value;
var format = document.getElementById("idFormato").value;
var recipient = "[recipient]]"
recipient = document.getElementById("idDestinatario").value;
var relationship = document.getElementById("idRelacion").value;

//Give GPT the instructions
inputPrompt= "Recipient: " + recipient + "\nRelationship: " + relationship + "\n";
inputPrompt= " Create a " + tone + " " + format + " in ENGLISH addressed to "+ recipient +" based on the following INPUT text.";

//Give GPT the input text
inputPrompt+="\nINPUT:\n" + document.getElementById("inputTextArea").value;

//Prompt it for the output text
inputPrompt+="\n\nOUTPUT:\n";

console.log('sending prompt:')
console.log("'" + inputPrompt + "'")

jsonPrompt = JSON.stringify({ prompt: inputPrompt });

console.log('in JSON:')
console.log(jsonPrompt)

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

const data = await response.text();

console.log("finished generating english text");

translateGPT(data);
console.log("server response: ");
console.log(data);

var element = document.getElementById("output");
element.innerHTML = data;

document.getElementById("spinner").style.display = "none";
document.getElementById("resultActions").style.opacity = '1'

displayIsEnglish = true;
englishResult = data;
}
</script>