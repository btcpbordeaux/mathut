var maf = {};
var particle = {};

//FUNctions
maf.factorial = function (v) {
  var memory;
  memory = v;
  while (v > 1) {
    v = v-1;
    memory = memory*v;
  }
  return memory
};


maf.factorial1 = function (v) {
  if (v == 1) {return 1}
    return v*maf.factorial1(v-1)
};

//closure fun
maf.funcFofA = function (a,f) {
  return function (x) {
      return  f(a,x)
  }
};

//enter the matrix
maf.matrix = function (array) {
  this.mat = array;
  this.height = array.length;
  this.width = array[0].length;
  this.print = function () {
    var str = [];
    for (var i = 0; i < this.height; i++) {
      str.push(this.mat[i].join(' '))
    }
    return str.join('\n');
  }
}

//vector object

maf.vector = function (array) {
  if (typeof array[0] === 'object') {
    array = maf.nByOne(array);
  }
  this.covec = array;
  this.height = array.length;
  var holder = new Array(this.height);
  for (var i = 0; i < this.height; i++) {
    holder[i] = [array[i]];
  }
  this.vec = new maf.matrix(holder);
  this.v = this.vec.mat;
  this.covecprint = function () {
    var str = [];
    for (var i = 0; i < this.height; i++) {
      str.push(this.covec[i])
    };
    return str.join('  ');
  };
  this.vecprint = function () {
    var str = [];
    for (var i = 0; i < this.height; i++) {
      str.push(this.vec.mat[i])
    };
    return str.join('\n');
  };
};

maf.nByOne = function (arr) {
  result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = arr[i][0].valueOf();
  }
  return result;
}

//scarla multi, a*v1 for a in R
maf.vector.prototype.scalarMulti = function (scal) {
//scalar * vector
  var x = new Array(this.height);
  for (var i = 0; i < this.height; i ++) {
    x[i] = scal * this.covec[i];
  };
  return x;
};


//magnitude of a vercter v1, || v1 ||
maf.vector.prototype.magnitude = function () {
  var s = 0;
    for (var i = 0; i < this.height; i++) {
        s += this.covec[i]*this.covec[i];
      }
 
  return Math.sqrt(s);
};

//dot product
maf.vector.prototype.dotProduct = function (other) {
  if (this.height !== other.length) {
    return 'and just what are you trying to do?!'
  }
  var sum = 0;
    for (var i = 0; i < this.height; i++) {
      sum += this.covec[i]*other[i];
    }
  return sum;
};


//angle, omega (w), between two vectors, invcos(A dot B / magA * magB)
maf.vector.prototype.angleBtwVectors = function (vec) {
  var other = new maf.vector(vec);
  if (this.height !== other.height) {
    return 'and just what kinda jazz you playin'
  }
  var denom, num, cosOmega;
  
  num = this.dotProduct(other.covec);
  denom = this.magnitude()*other.magnitude();
  cosOmega = num / denom;
  
  return Math.acos(cosOmega);

};


//cross product
maf.vector.prototype.crossProduct = function (other) {
  if (this.height !== 3 && this.height !== 3) {
    return 'cross product only defined in 3 dimensions, bro'
  }
  var cross = [];
  var crossed;
    cross = [this.covec[1]*other[2] - this.covec[2]*other[1], this.covec[2]*other[0] - this.covec[0]*other[2], this.covec[0]*other[1] - this.covec[1]*other[0]]
  crossed = new maf.vector(cross);
  return crossed;
};

maf.matrixMult = function (a,b) {
  if (a[0].length !== b.length) {return 'yo, that doesnt work crazy face'}
  var rows = a.length;
  var arowsbcols = a[0].length
  var cols = b[0].length;
  var ab = new Array(rows);
  for (var i = 0; i < rows; i++) {
    ab[i] = new Array(cols);
    for (var j = 0; j < cols; j++) {
      ab[i][j] = 0; //intialize the component
      for (var m = 0; m < arowsbcols; m++) {
        ab[i][j] += a[i][m] * b[m][j];
      } 
    }
  }
  return ab;
};

maf.matrix.prototype.multiply = function (other) {
  return maf.matrixMult(this.mat, other);
};

maf.vector.prototype.vecMulti = function (matrix) {
  return maf.matrixMult(this.vec, matrix);
};



function ya (mat, it, vec) {
var result = mat.multiply(vec);
var norman;
for (var i = 0; i < it-1; i++) {
  result = mat.multiply(result)
  
}
if (result[0].length == 1) {
  normalize = new maf.vector(result);
  norman = normalize.magnitude();
  result = maf.nByOne(result);
  for (var i = 0; i < result.length; i++) {
    result[i] = result[i]/norman;
  };
  result = new maf.vector(result);
  return result;
  } else {
  result = new maf.matrix(result);
    return result;
  }
  
}

var gg = [0,0,1];
var mat;
mat = new maf.matrix([[1,2,5],[3,4,7],[1,3,5]]);


 
var mm=new maf.matrix([
    [1,1,-1],
    [2,1,0],
    [0,5,4]
    ]);
    
var vv=[
    [1],
    [0],
    [3]
    ];

$log.debug(ya(mm,10,vv));

maf.matrixPower = function (mat, vec) {
    var normal;
    var largest;
    var c = 1;
    var epsilon = [];
    var result;
    var Epsilon;
    var normalize;
    result = mat.multiply(vec);
    
    //build the vector of radii
    for (var i = 0; i < vec.length; i++) {
      epsilon[i] = Math.abs(result[i][0] - vec[i][0]);
    };
    //pick biggest radii for epilson ball
    Epsilon = Math.max.apply(null, epsilon);
    //work until we are within our ball
    //since epilson is a decreasing monotonic sequence,
    //we need not worry about jumping out of ball...
    //if we do, then eigenvalues are complex and 
    //vector is rotating, in which case,
    //RUN FOR YOUR LIFE, AHHHHHHHHHHHHHHHH!
    //then sequence of Epsilons will be likely bounded
    //but not cauchy, decreasing, or convergent
    //trying to figure out way to derive eigen info from
    //looking at angle of rotation for high iterations 
    //of multiplicaiton, will post results in future  
      while (Epsilon > 1/100000000000)  {
        var newv = [];
        var oldv = [];
        var vnewv;
        var voldv;
        var newmag;
        var oldmag;
          
          newv = mat.multiply(result);
          oldv = result;
          vnewv = new maf.vector(newv);
          voldv = new maf.vector(oldv);
          newmag = vnewv.magnitude();
          oldmag = voldv.magnitude();
          


        for (var i = 0; i < vec.length; i++) {
          epsilon[i] = Math.abs(newv[i][0]/newmag - oldv[i][0]/oldmag); 
          };
          
        normalize = new maf.vector(newv);
        normalize = normalize.magnitude();
        
        Epsilon = Math.max.apply(null, epsilon);
        result = mat.multiply(result);
        
        for (var j = 0; j < vec.length; j++) {  
          result[j][0] = result[j][0]/normalize;
          };
         c++;
      }
       $log.debug(result);
       $log.debug(Epsilon);
       $log.debug(c);
       return [result, Epsilon, c];
};
