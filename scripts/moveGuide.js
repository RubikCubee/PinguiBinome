document.addEventListener("DOMContentLoaded", init, false);

var scene = document.querySelector('a-scene');
var player;
var table;
var guide;
var target; 
var path; 
var currentNode = 0;
var steering;
var path = [];
var MAX_SEE_AHEAD;
var obstacle;
var avoidance;

function distance(pos1, pos2)
{
    var distance = Math.sqrt((pos1.x - pos2.x)*(pos1.x - pos2.x) + (pos1.y - pos2.y)*(pos1.y - pos2.y) +  (pos1.z - pos2.z)*(pos1.z - pos2.z));
    return distance;
}

class Obstacle
{
    constructor(actor)
    {
        this.actor = actor;
        this.position = new Vec3(0,0,0);
        this.center = new Vec3(0,0,0);
        this.radius = 3;
    }

    getCenter()
    {
        var position = this.actor.getAttribute("position");
        this.center = new Vec3(position.x, position.y, position.z);
        return this.center;
    }

}

class GuideAutomated 
{
    constructor()
    {
        this.actor = document.getElementById("penguin");
        this.ahead = null;
        this.ahead2 = null;
        this.isMooving = false;     
        this.velocity = new Vec3(0,0,0);
        this.position = new Vec3(0,0,0);  
        this.rotation = new Vec3(0,0,0); 
        this.initialRotation = new Vec3(0,0,0);
    }

    getPosition()
    {
        var position = this.actor.getAttribute("position");
        this.position = new Vec3(position.x, position.y, position.z);
        return this.position;
    }

    setPosition(x,y,z)
    {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    getRotation()
    {
        var rot = this.actor.getAttribute("rotation");
        this.rotation = new Vec3(rot.x, rot.y, rot.z);
        return this.rotation;
    }

    setRotation(angle)
    {
        var rot = {"x":0, "y":0, "z":0};
        rot.x = -90;
        rot.y = this.initialRotation.y + angle;
        rot.z = 0;
        this.actor.setAttribute("rotation", rot);

        // Ne rotater que sur l'axe y 
        this.rotation = new Vec3(rot.x, rot.y, rot.z);
        this.rotation.print();
    }

    move(position)
    {
        this.position = position;

        var pos = {"x":0, "y":0, "z":0};
        var posGuide = this.position;
        pos.x = posGuide.x;
        pos.y = 0
        pos.z = posGuide.z;

        this.actor.setAttribute("position", pos);
    }
}

function init() 
{    
    // creer le guide
    guide = new GuideAutomated();
    guide.actor.addEventListener('click', onClickGuide);

    // get the player/the camera
    player = document.getElementById("camera");
    table = document.getElementById("table");
    table.radius = 1.5;
    // initialisation des variables 
    obstacle = new Obstacle(player);
    obstacle2 = new Obstacle(table);
    steering = new Vec3(0,0,0);
    avoidance = new Vec3(0,0,0);
}                                                                                                                                            

function onClickGuide(e)
{
    var sphereBobEponge = document.getElementById("sphereBobEponge");
    var sphereLaitierePipe = document.getElementById("sphereLaitierePipe");
    var sphereFenetre = document.getElementById("sphereFenetre");
    var sphereMonsieurPomme = document.getElementById("sphereMonsieurPomme");
    var sphereJeuneFillePerle = document.getElementById("sphereJeuneFillePerle");
    var sphereCheminee = document.getElementById("sphereCheminee");
    var sphereBretagne = document.getElementById("sphereBretagne");
    var sphereAccueil = document.getElementById("sphereAccueil");

    path = [sphereBobEponge, sphereLaitierePipe,sphereFenetre,sphereMonsieurPomme,sphereJeuneFillePerle,sphereCheminee,sphereBretagne,sphereAccueil];

    currentNode = 0;
    target = path[currentNode];
    targetReached = setInterval(moveGuide, 5);
}

function pathFollowing()
{
    if(path != null)
    {
        target = path[currentNode];

        var dist =  distance(guide.getPosition(), Vec3.toVec3(target.getAttribute("position")));

        if(dist <= 2.5)
        {
            currentNode += 1;

            if (currentNode >= path.length) 
            {           
                //currentNode = 0;
            }
        }
    }
    return new Vec3(0,0,0);
}

function collisionAvoidance()
{
    var MAX_SEE_AHEAD = 4;
    var MAX_AVOIDANCE_FORCE = 1.5;

    var ahead = Vec3.add(guide.getPosition(), Vec3.mul(guide.velocity, MAX_SEE_AHEAD));
    var ahead2 = Vec3.add(guide.getPosition(), Vec3.mul(guide.velocity, MAX_SEE_AHEAD*0.5));

    var collision = false;

    if(lineIntersectCircle(ahead, ahead2, obstacle) || lineIntersectCircle(ahead, ahead2, obstacle2) )
    {
        collision = true;
    }
    else
    {
        avoidance = new Vec3(0,0,0);
    }

    if(obstacle != null & collision)
    {
        avoidance.x = ahead.x - obstacle.getCenter().x;
        avoidance.z = ahead.z - obstacle.getCenter().z;

        avoidance = Vec3.mul(Vec3.normalize(avoidance), MAX_AVOIDANCE_FORCE);
    }
    else if(obstacle2 != null & collision)
    {
        avoidance.x = ahead.x - obstacle2.getCenter().x;
        avoidance.z = ahead.z - obstacle2.getCenter().z;

        avoidance = Vec3.mul(Vec3.normalize(avoidance), MAX_AVOIDANCE_FORCE);
    }

    return avoidance;
}

function seek(targ)
{
    return guide.velocity = Vec3.mul(Vec3.normalize(Vec3.sub(Vec3.toVec3(targ.getAttribute("position")), guide.getPosition())), 0.1);   
}

function moveGuide()
{
    steering = Vec3.add(steering, seek(target));

    guide.initialRotation = guide.velocity;

    steering = Vec3.add(steering, pathFollowing());
    steering = Vec3.add(steering,collisionAvoidance());
    steering = Vec3.truncate(steering, 2);
    guide.velocity = Vec3.truncate(Vec3.add(guide.velocity, steering), 0.1);
    
    var newDirection = guide.velocity;

    lookAt(guide.initialRotation, newDirection);
    var newPos  = Vec3.add(guide.getPosition(), guide.velocity);
    guide.move(newPos);
}

function lookAt(oldDirection, newDirection)
{
    //var angle = Math.atan2(oldDirection.z - newDirection.z, oldDirection.x - newDirection.x)*180 / Math.PI;
    //var angle = Math.acos(oldDirection.dot(newDirection)/oldDirection.length() * newDirection.length());
    //alert(angle);
    //guide.setRotation(angle);
   
}

function lineIntersectCircle(ahead, ahead2, obs)
{
    var isIntersect = distance(obs.getCenter(), ahead) <= obs.radius || distance(obs.getCenter(), ahead2) <= obs.radius;
    return isIntersect;
}
