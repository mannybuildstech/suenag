<script>

function share()
{
    navigator.share({
    title: 'Esto esta buenisimo para escribir ingles!!',
    text: 'Use esta pagina para componer mensajes en ingles!',
    url: 'https://suenagringo.carrd.co/',
    })
}
async function callGPT()
{
    document.getElementById("responseContainer").style.display = "block";
    document.getElementById('resultActions').style.opacity = '0';
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


    const response = await fetch(`https://wrappedgpt1.azurewebsites.net/api/azurefunctiongpt?promptType=freeform`, options);

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    const data = await response.text();
    console.log("server response: ");
    console.log(data);

    var element = document.getElementById("output");
    element.innerHTML = data;


    document.getElementById("resultActions").style.display = "block";
    document.getElementById("spinner").style.display = "none";
}
</script>