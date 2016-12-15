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
