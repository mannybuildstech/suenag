<script>

var spanishResult;
var englishResult;

var displayIsEnglish;

//Data cache
var tone = "formal";
var format = "text";
var relationship = "friend";

var freePlan = false;
var basicPlan = false;
var ultraPlan = false;

var trialExpired = false;

var toneText;
var formatText;
var relationshipText;

var globalMemberEmail="";

window.onpopstate = function(event) {
SetLoadingState()
};

//set focus to input box on load
window.onload = function() {
document.getElementById("inputTextArea").focus();
};

var selectionElementId = "freeSelection";

function updateMemberSpaceValues()
{
console.log("updateMemberSpaceValues called");
if (!freePlan && !basicPlan && !ultraPlan)
{
console.log("no plan available!");
//open url in same tab
trialExpired = true;
window.location.href = "https://wisetools1.memberspace.com/member/sign_in";
}
else
{
console.log("freePlan: " + freePlan);
console.log("basicPlan: " + basicPlan);
console.log("ultraPlan: " + ultraPlan);

if (freePlan)
selectionElementId = "freeSelection";
else if (basicPlan)
selectionElementId = "basicSelection";
else if (ultraPlan)
selectionElementId = "ultraSelection";

console.log("grabbing data from select element: " + selectionElementId);
}
console.log("updateMemberSpaceValues finished");
}

function goBack()
{
history.back()

mixpanel.track('goBack', {
'source': "suenagringo",
'memberEmail': globalMemberEmail
});
}

function scanDocument()
{
mixpanel.track('scanDocument', {
'source': "suenagringo",
'memberEmail': globalMemberEmail
});

}

function copy()
{
var result = document.getElementById("output").innerHTML;
navigator.clipboard.writeText(result);
console.log("copy() called");

mixpanel.track('copy', {
'source': "suenagringo",
'memberEmail': globalMemberEmail
});
}

function flipLanguage()
{

mixpanel.track('flipLanguage', {
'source': "suenagringo",
'memberEmail': globalMemberEmail
});
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
console.log("****** translateGPT *********");
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
//document.getElementById("resultActions").style.opacity = "1";

copy();
console.log("SetEndState copy called");
}

function SetLoadingState()
{
console.log("SetLoadingState called");
//setup UI - hide result buttons
document.getElementById("doneMenu").style.opacity = '0'
//setup UI - show loading spinner
document.getElementById("spinner").style.display = "block";
//output
//TODO - make this more interesting, either the types, or random english education...
//document.getElementById("output").innerHTML = "Generando " + formatText + " con tono " + toneText + " para tu" + relationshipText + "...";
document.getElementById("output").innerHTML = "Generando sugerencias...";
}

function loadInputValues()
{

toneOption = document.getElementById("idVibra");
if (toneOption)
{
tone = toneOption.value;
toneText = toneOption.options[toneOption.selectedIndex].text;
}

formatOption = document.getElementById(selectionElementId);
if (formatOption)
{
format = formatOption.value;
formatText = formatOption.options[formatOption.selectedIndex].text;
}

relationshipOption = document.getElementById("idRelationshipSection");
if (relationshipOption)
{
relationship = relationshipOption.value;
relationshipText = relationshipOption.options[relationshipOption.selectedIndex].text;
}

console.log("tone: " + tone);
console.log("format: " + format);
console.log("relationship: " + relationship);

memberEmailSpan = document.getElementById("memberEmail");
globalMemberEmail = memberEmailSpan.value;

mixpanel.track('Text Generation', {
'source': "suenagringo",
'tone': tone,
'format': format,
'recipientType': relationship,
'memberEmail': globalMemberEmail
});

}

function expirationBlock()
{
console.log("expired! not letting them use the system");
//send them to account page
window.location.href = "https://wisetools1.memberspace.com/member/sign_in";
var result = document.getElementById("output").innerHTML = "Su plan ha expirado. Actualice su plan entrando a su 'Cuenta' para continuar usando el sistema.";
return;
}

async function callGPT()
{

loadInputValues();
SetLoadingState();

console.log("********* Start of callGPT ********* ")

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