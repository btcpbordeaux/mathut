
  var ut = {};
  var abs = Math.abs;
  
      ut.offsetTop = function (e) {
       
        var x = 0;
        do {
          if (!isNaN(e.offsetTop)) {
            x += e.offsetTop;
          }
       } 
       while (e = e.offsetParent)
       return x; 
      };
      ut.offsetTopById = function (i) {
        var x = 0;
        var id = i.toString();
        var elem = document.getElementById(id);
        do {
          if (!isNaN(elem.offsetTop)) {
            x += elem.offsetTop;
          }
       } 
       while (elem = elem.offsetParent)
       return x; 
      };
      ut.offsetLeftById = function (i) {
        var x = 0;
        var id = i.toString();
        var elem = document.getElementById(id);
        do {
          if (!isNaN(elem.offsetLeft)) {
            x += elem.offsetLeft;
          }
       } 
       while (elem = elem.offsetParent)
       return x; 
      };

      
//NOT MINE, FROM MATRIX.JS//////////////////////////////////////////////////////////////////
   //think its peter coxhead (that name tho)
      function _foreach2(x, s, k, f) {
        if (k === s.length - 1) return f(x);
        var i, n = s[k], ret = Array(n);
        for (i = n - 1; i >= 0; --i) ret[i] = _foreach2(x[i], s, k + 1, f);
        return ret;
      }

      function _dim(x) {
        var ret = [];
        while (typeof x === "object") ret.push(x.length), x = x[0];
        return ret;
      }

      function dim(x) {
        var y, z;
        if (typeof x === "object") {
          y = x[0];
          if (typeof y === "object") {
            z = y[0];
            if (typeof z === "object") {
              return _dim(x);
            }
            return [x.length, y.length];
          }
          return [x.length];
        }
        return [];
      }

      function cloneV(x) {
        var _n = x.length, i, ret = Array(_n);
        for (i = _n - 1; i !== -1; --i) ret[i] = x[i];
        return ret;
      }

      function clone(x) {
        return typeof x !== "object" ? x : _foreach2(x, dim(x), 0, cloneV);
      }

      function LU(A, fast) {
        fast = fast || false;

        var i, j, k, absAjk, Akk, Ak, Pk, Ai,
            max,
            n = A.length, n1 = n - 1,
            P = new Array(n);

        if (!fast) A = clone(A);

        for (k = 0; k < n; ++k) {
          Pk = k;
          Ak = A[k];
          max = abs(Ak[k]);
          for (j = k + 1; j < n; ++j) {
            absAjk = abs(A[j][k]);
            if (max < absAjk) {
              max = absAjk;
              Pk = j;
            }
          }
          P[k] = Pk;

          if (Pk != k) {
            A[k] = A[Pk];
            A[Pk] = Ak;
            Ak = A[k];
          }

          Akk = Ak[k];

          for (i = k + 1; i < n; ++i) {
            A[i][k] /= Akk;
          }

          for (i = k + 1; i < n; ++i) {
            Ai = A[i];
            for (j = k + 1; j < n1; ++j) {
              Ai[j] -= Ai[k] * Ak[j];
              ++j;
              Ai[j] -= Ai[k] * Ak[j];
            }
            if (j===n1) Ai[j] -= Ai[k] * Ak[j];
          }
        }

        return {
          LU: A,
          P:  P
        };
      }

      function LUsolve(LUP, b) {
        var i, j,
            LU = LUP.LU,
            n = LU.length,
            x = clone(b),
            P = LUP.P,
            Pi, LUi, tmp;

        for (i = n - 1; i !== -1; --i) x[i] = b[i];
        for (i = 0; i < n; ++i) {
          Pi = P[i];
          if (P[i] !== i) tmp = x[i], x[i] = x[Pi], x[Pi] = tmp;
          LUi = LU[i];
          for (j = 0; j < i; ++j) {
            x[i] -= x[j] * LUi[j];
          }
        }

        for (i = n - 1; i >= 0; --i) {
          LUi = LU[i];
          for (j = i + 1; j < n; ++j) {
            x[i] -= x[j] * LUi[j];
          }
          x[i] /= LUi[i];
        }

        return x;
      }
//END STUFF FROM MATRIX.JS/////////////////////////////////////////////////////////////////////////////
      ut.solve = function(A, b, fast) {
      return LUsolve(LU(A, fast), b);
      };
      var getVector = function (p1,p2) {
      return {x: p1.x - p2.x, y: p1.y - p2.y};
      }
      var det = function (v1,v2) {
        return (v1.x*v2.y - v1.y*v2.x);
      }
     
      ut.isConcave = function (p) {
      var current_deter, deter, v0, v1;

      v0 = getVector(p[0], p[p.length-1]);
      v1 = getVector(p[1], p[0]);
      deter = det(v0, v1);

      for (var i = 1; i < p.length-1; i ++) {
        v0 = v1;
        v1 = getVector(p[i+1],p[i]);
        current_deter = det(v0, v1);
        
        if (current_deter*deter < 0) {return true}
        deter = current_deter;
      }
      v0 = v1;
      v1 = getVector(p[0], p[p.length-1]);
      current_deter = det(v0,v1);
     
      if (current_deter*deter < 0) {return true}
        else {return false}
      }

//base off a SO post I saw
//http://stackoverflow.com/questions/1960473/unique-values-in-an-array
//originally by user Raphael
//I just made it slightly more general
 Array.prototype.uniqueMembers = function (checkSortedArrays) {
                var tmp = {},
                    ret = [];
                if (checkSortedArrays == undefined) {checkSortedArrays = false;}
                for (var i = 0; i < this.length; i++) {
                    switch (typeof this[i]) {
                        case 'string':
                            if (tmp.hasOwnProperty(this[i])) {
                                    continue;
                                }  
                                ret.push(this[i]);
                                tmp[this[i]] = 'ayyy lmao'
                            break;
                        case 'number':
                            if (tmp.hasOwnProperty(this[i])) {
                                    continue;
                                }  
                                ret.push(this[i]);
                                tmp[this[i]] = 'ayyy lmao';
                                 
                            break;
                        case 'object':
                                var keys = Object.keys(this[i]),
                                    keyString = "";
                            //figure out if typeof this[i] == 'object'
                            //is referring to {} or []
                            //by checking if the keys can be cast 
                            //to numbers by Number()
                            switch (isNaN(Number(keys[0]))) {
                                //keys of object this[i] are strings => case this[i] is 'object'
                                case true:
                                    for (var n = 0; n < keys.length; n++) {
                                        switch (typeof this[i][keys[n]]) {
                                            case 'number':
                                                if (this[i][keys[n]] < 0) {
                                                    var pos = -1; 
                                                        pos *= this[i][keys[n]];
                                                        keyString += keys[n]+"_"+"n"+pos+"_";
                                                } else if (this[i][keys[n]] >= 0) {
                                                    keyString += keys[n]+"_"+this[i][keys[n]]+"_";
                                                }
                                                    break;
                                            case 'string':
                                                keyString += keys[n]+"_"+this[i][keys[n]]+"_";
                                                break;
                                        };
                                    }
                                    if (tmp.hasOwnProperty(keyString)) {
                                        continue;
                                    }
                                    ret.push(this[i]);
                                    tmp[keyString] = "ayyy lmao";
                                    break;
                                //keys of object this[i] are numbers => case this[i] is array
                                case false:
                                    if (checkSortedArrays == false) {
                                        console.log("checkSortedArrays == false");
                                        //this only will match arrays with
                                        //same entry in the same position
                                        //[3,1,2] != [1,2,3]
                                        this[i] = this[i];
                                        } else if (checkSortedArrays == true) {
                                        console.log("checkSortedArrays == true")
                                        //this will sort the arrays
                                        //assuming this[i] = varchar[] or int[] or char[] or whatever[]
                                        //but not [[]] or [{}]
                                        this[i] = this[i].sort();
                                        //ya, this function won't sort
                                        //numbers correctly because, for example,
                                        //in unicode, the point order of 10 is greater
                                        //than 2 so [2,10,1].sort() == [1,10,2]
                                        //but we don't care about that
                                        //just a consistent means of sorting
                                        }
                                        for (var n = 0; n < this[i].length; n++) {
                                            switch (typeof this[i][n]) {
                                                case 'number':
                                                    if (this[i][n] < 0) {
                                                        var pos = -1; 
                                                            pos *= this[i][n];
                                                            keyString += "p"+n+"_"+"n"+pos+"_";
                                                    } else if (this[i][n] >= 0) {
                                                        keyString += "p"+n+"_"+this[i][n]+"_";
                                                    }
                                                    break;
                                                case 'string':
                                                    keyString += "p"+n+"_"+this[i][keys[n]]+"_";
                                                    break;
                                            };
                                        };
                                     //console.log(keyString);
                                    if (tmp.hasOwnProperty(keyString)) {
                                        continue;
                                    }
                                    
                                    ret.push(this[i]);
                                    tmp[keyString] = "ayyy lmao";
                                    
                                    break;
                            };
                            break;
                    }
                }
                return ret;
        }
