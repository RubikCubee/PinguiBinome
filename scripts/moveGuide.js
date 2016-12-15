document.addEventListener("DOMContentLoaded", init, false);

var scene = document.querySelector('a-scene');
var player;
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

class Vec3
{
    constructor(x,y,z)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    static add(vec1, vec2)
    {
        var vec = new Vec3(0,0,0);
        vec.x = vec1.x + vec2.x;
        vec.y = vec1.y + vec2.y;
        vec.z = vec1.z + vec2.z;

        return vec;
    }

    static sub(vec1, vec2)
    {
        var vec = new Vec3(0,0,0);
        vec.x = vec1.x - vec2.x;
        vec.y = vec1.y - vec2.y;
        vec.z = vec1.z - vec2.z;

        return vec;
    }

    static mul(vec1, cte)
    {
        var vec = new Vec3(0,0,0);
        vec.x = vec1.x * cte;
        vec.y = vec1.y * cte;
        vec.z = vec1.z * cte;
        return vec;
    }

    static normalize(vect)
    {
        var length = Math.sqrt((vect.x*vect.x) + (vect.y*vect.y) + (vect.z*vect.z));

        var vec = new Vec3(0,0,0);
        vec.x = vect.x/length;
        vec.y = vect.y/length;
        vec.z = vect.z/length; 

        return vec;
    }

    static toVec3(position)
    {
        var vec = new Vec3(0,0,0);
        vec.x = position.x;
        vec.y = position.y;
        vec.z = position.z;
        return vec;
    }

    static truncate(original, coef)
    {
        var vec = this.normalize(original);
        vec = this.mul(vec, coef);
        return vec;    
    }

    isNull()
    {
        if(this.x == 0 && this.y == 0 && this.z == 0)
        {
            return true;
        }

        return false;
    }

    set(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;        
    }

    dot(v)
    {
        return this.x*v.x+ this.y*v.y + this.z*v.z;
    }

    length()
    {
        return Math.sqrt(this.dot(this));
    }

    print()
    {
        alert(this.x + "------" + this.y + "------" + this.z);
    }
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

// Guide with some vector to move him
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
        rot.y = initialRotation.y + angle;
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
    player = document.getElementById("camera")

    // initialisation des variables 
    obstacle = new Obstacle(player);
    steering = new Vec3(0,0,0);
    avoidance = new Vec3(0,0,0);
}                                                                                                                                            

function onClickGuide(e)
{
    var sphere_1 =  document.getElementById("sphere-dir-1"); 
    var sphere_2 =  document.getElementById("sphere-dir-2"); 
    var sphere_3 =  document.getElementById("sphere-dir-3"); 
    var sphere_4 =  document.getElementById("sphere-dir-4"); 
    path = [sphere_1, sphere_2, sphere_3, sphere_4]

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

    if(lineIntersectCircle(ahead, ahead2, obstacle))
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
    var angle = Math.acos(oldDirection.dot(newDirection)/oldDirection.length() * newDirection.length());
    alert(angle);
    guide.setRotation(angle);
   
}

function lineIntersectCircle(ahead, ahead2, obs)
{
    var isIntersect = distance(obs.getCenter(), ahead) <= obs.radius || distance(obs.getCenter(), ahead2) <= obs.radius;
    return isIntersect;
}
