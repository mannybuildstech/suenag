<script>
window.addEventListener("load", (event) => {
console.log("page is fully loaded");
animateHeader()
});

function animateHeader()
{
    // Get a reference to the element that you want to animate
    const element = document.getElementById('landingPageTitle');

    // Set the interval for the animation (in milliseconds)
    const interval = 2000;

    var i = 1

    const titles = ["textea 📱", "crea flyers 📰", "postea 🐦", "manda 📧", "cierra 🤝", "enamora 💑"];
    
    //Execute every 3 seconds
    setInterval(function()
    {
        // Fade out the element
        
        setTimeout(() => 
        {
            element.style.transition = 'opacity 1s ease-in'
            element.style.opacity = 0;
            element.innerHTML= titles[i] + "</br>como todo un gringo!";    
        }, 1000);

        // Fade in
        setTimeout(function() 
        {
            
            element.style.transition = 'opacity 1s ease-in';
            element.style.opacity = 1;
        }, 1000);

        i = i +1
        if (i > titles.length-1)
            i=0

    }, interval);
}

function updateHeader()
{
    
}

</script>