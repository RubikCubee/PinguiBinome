document.addEventListener("DOMContentLoaded", init, false);
var scene = document.querySelector('a-scene');
var positionReached;
var positionBoule;
var objToMove;
var objReached; 
var nextTarget;
var rotation_obj;

function init() 
{    
    nextTarget = 0
    // Gestion du click sur une sphere
    document.getElementById("sphereBobEponge").addEventListener('click', onClickSphere);
    document.getElementById("sphereLaitierePipe").addEventListener('click', onClickSphere);
    document.getElementById("sphereFenetre").addEventListener('click', onClickSphere);
    document.getElementById("sphereMonsieurPomme").addEventListener('click', onClickSphere);
    document.getElementById("sphereJeuneFillePerle").addEventListener('click', onClickSphere);
    document.getElementById("sphereCheminee").addEventListener('click', onClickSphere);
    document.getElementById("sphereBretagne").addEventListener('click', onClickSphere);
    document.getElementById("sphereAccueil").addEventListener('click', onClickSphere);
}

function onClickSphere(e)
{
    positionReached = setInterval(moveToSphere, 50);
    positionBoule = this.getAttribute("position")
    objToMove = document.getElementById("camera")
}

function stopAnim()
{
    clearInterval(positionReached);
}

function moveToSphere()
{
    // Recuperation de la position de la camera
    var positionObj = objToMove.getAttribute("position")

    if (positionObj.x > positionBoule.x + 0.5) 
    {
        positionObj.x-=0.1;
    }
    else if(positionObj.x < positionBoule.x - 0.5) 
    {
        positionObj.x += 0.1;
    }
    else
    {
        positionObj.x = positionBoule.x
    }
    // Gestion de la position en Z
    if (positionObj.z > positionBoule.z + 0.5) 
    {
        positionObj.z -= 0.1;
    }
    else if(positionObj.z < positionBoule.z - 0.5)
    {
        positionObj.z += 0.1;
    }
    else 
    {
        positionObj.z = positionBoule.z
    }

    objToMove.setAttribute("position", positionObj)

    // Test pour savoir si la camera a atteint la position
    if (positionObj.x == positionBoule.x && positionObj.z == positionBoule.z)
    {
        stopAnim()
    }

}