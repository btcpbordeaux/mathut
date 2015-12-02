//shorthand functions
    var particles = [];

    var patriclesNum = 5;
    //distance between balls where detection starts
    var buffer = 15;
    
      //some constants
    var PI = Math.PI,
        PI2 = 2*PI,
        PIo4 = PI/4,
        PIo2 = PI/2;

    //speed limit
    var ludicrousSpeed = 6;
    var random = function () {
      return Math.random();
      };
    var round = function (a) {
      return Math.round(a);
      };
    var sin = function (a) {
      return Math.sin(a);
      };
    var asin = function (a) {
      return Math.asin(a);
      };
    var tan = function (a) {
      return Math.tan(a);
      };  
    var square = function (a) {
      return Math.pow(a,2);
      };
    var root = function (a) {
      return Math.sqrt(a);
    };
    var cos = function (a) {
      return Math.cos(a);
      };
    var atan2 = function (a,b) {
      return Math.atan2(a,b);
      };
    var abs = function (a) {
      return Math.abs(a);
    };
    var hypot = function (a,b) {
      return root(square(a)+square(b));
      };
    var distance = function (p1, p2) {
      return hypot(p1.x - p2.x, p1.y - p2.y);
    };
  
    //get random rgb value
    var color = function () {
      var  r = random()*255|0,
        g = random()*255|0,
        b = random()*255|0,
        a = random()*1;
        return 'rgba('+r+','+g+','+b+','+a+')';
    };
    var colors = [color(), color(); color(); color()]
    //make canvas
    var c = document.getElementById("tv");
    var ctx = c.getContext("2d"), w, h;

    c.height = 400;
    c.width = 1000;
    h = c.height;
    w = c.width;
   
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);
    
    //clear canvas to advance fram
    function clear () {
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,c.width,c.height);
    };

      var  vx = 100,
        vy = -50,
        rad = 10,
        //set the stage
        top = h*0.1,
        floor = h*0.9,
        right = w*0.9,
        left = w*0.1,
        //for single particle
        posX = right*Math.random();
        posY = floor*Math.random();
        //'gravity', pixel count += dy/dt
        //occurs right before new circle is drawn
        grav = 0;


     //testing a single particle
    function move () {
      posX += vx;
      posY += vy;
    };
    function bounce () {
      //ground
      if (posY + rad > floor) {
        vy *= -1;
        
        posY = floor - rad;
      }
      //ceiling
      if (posY - rad < top) {
        vy *= -1;
        posY = top + rad;
      }
      //right wall
      if (posX + rad > right) {
        vx *= -1;
        posX = right - rad;
      }
      //left wall
      if (posX - rad < left) {
        vx *= -1;
        posX = left + rad;
      } 
    };
    function gravity () {
      vy += grav;
    };

     function circle () {
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(posX, posY, 10, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
    };

      //buggy
    function boom (p1,p2) {
    
      var g, gcomp, a1, a2;
      var d = {
        x: p1.x - p2.x,
        y: p1.y - p2.y,
       };
       d.hype = hypot(d.x,d.y);
      //test for collision
      if (d.hype < p1.rad + p2.rad) {
        $log.debug('collision has occured');
        g = atan2(d.y, d.x);
        gcomp = PI/2 + g;
        a1 = 2*gcomp - p1.angle();
        a2 = 2*gcomp - p2.angle();
        p1.vx *= cos(a1);
        p1.vy *= sin(a1);
        p2.vx *= cos(a2);
        p2.vy *= sin(a2);

        p1.x += sin(g);
        p1.y += cos(g);
        p2.x += sin(g);
        p2.y += cos(g);
      }
    };
    //buggy
    function boom2 () {
        var alpha, R;
        var vxcm, vycm, gammav, gammaxy, dgamma, dr, dc, a;
        var d = {
          x: p.x - this.x,
          y: p.y - this.y,
         };
        d.hype = hypot(d.x,d.y);
      
        vxcm = (p.vx*p.mass + this.vx*this.mass) / (p.mass + this.mass);
        vycm = (p.vy*p.mass + this.vx*this.mass) / (p.mass + this.mass); 
        
        //if they are not moving relatively to 
        //one another, get to the choppa!
        if (p.vx - this.vx == 0 && p.vy - this.vy == 0) {
          $log.debug('not gonna hit');
        }
        gammav = atan2(-(p.vy - this.vy), -(p.vx - this.vx));
       
        //if the balls are inside one another
        if (d.hype < this.rad + p.rad) {
          $log.debug('ahh');
          return;
        }

        //relative position angle and normalized impact parameter
        gammaxy = atan2(p.y - this.y, p.x - this.x);
        dgamma = gammaxy - gammav;

        if (dgamma > PI2) {dgamma = dgamma - PI2;}
          else if (dgamma < -PI2) {dgamma = dgamma + PI2;}

        dr = d.hype * sin(dgamma) / (this.rad + p.rad);

        //old positions and velocities if balls do not collide
        if ((abs(dgamma) > PIo4 && abs(dgamma) < 0.75*PI2) || abs(dr) > 1) {
          $log.debug('cool');
          return;
        }

        //get impact angle if balls collide
        alpha = asin(dr);

        //get time to collision
        dc = d.hype*cos(dgamma);
        if (dc > 0) {sqs = 1;} else {sqs = -1;}
        
        t=(dc-sqs*(this.rad + p.rad)*root(1-dr*dr))/hypot(p.vy - this.vy, p.vx - this.vx);
        
        //update positions
        this.x += this.vx*t;
        this.y += this.vy*t;
        p.x += p.vx*t;
        p.y += p.vy*t;

        //  update velocities 
        a = tan( gammav + alpha);
        dvx2=-2*(p.vx - this.vx + a*(p.vy - this.vy)) /((1 + a*a)*(1 + (p.mass/this.mass)));
       
        p.vx += dvx2;
        p.vy += a*dvx2;
        this.vx -= (p.mass/this.mass)*dvx2;
        this.vy -= a*(p.mass/this.mass)*dvx2;

     //for inelastic collisions 
     /*
        this.vx = (vx1 - vx_cm)*R + vx_cm;
        this.vy = (vy1 - vy_cm)*R + vy_cm;
        p.vx = (vx2 - vx_cm)*R + vx_cm;
        p.vy = (vy2 - vy_cm)*R + vy_cm;
        */
    }
     
         function Factory(){  
        this.x =  round( random() * w);
        this.y =  round( random() * h);
        this.rad = round( random() * 1) + 1;
        this.rgba = colors[ round( random() * 3) ];
        this.vx = round( random() * 3) - 1.5;
        this.vy = round( random() * 3) - 1.5;
      }

       function draw(){
        clear();
  
        for(var i = 0;i < patriclesNum; i++){
          var temp = particles[i];
          var factor = 1;
       
          for(var j = 0; j<patriclesNum; j++){
            
             var temp2 = particles[j];
             ctx.linewidth = 0.5;
            
             if(temp.rgba == temp2.rgba && findDistance(temp, temp2)<100){
                ctx.strokeStyle = temp.rgba;
                ctx.beginPath();
                ctx.moveTo(temp.x, temp.y);
                ctx.lineTo(temp2.x, temp2.y);
                ctx.stroke();
                factor++;
              }
            }
      
      
          ctx.fillStyle = temp.rgba;
          ctx.strokeStyle = temp.rgba;
          
          ctx.beginPath();
          ctx.arc(temp.x, temp.y, temp.rad*factor, 0, Math.PI*2, true);
          ctx.fill();
          ctx.closePath();
          
          ctx.beginPath();
          ctx.arc(temp.x, temp.y, (temp.rad+5)*factor, 0, Math.PI*2, true);
          ctx.stroke();
          ctx.closePath();
          

          temp.x += temp.vx;
          temp.y += temp.vy;
          
          if(temp.x > w)temp.x = 0;
          if(temp.x < 0)temp.x = w;
          if(temp.y > h)temp.y = 0;
          if(temp.y < 0)temp.y = h;
        }
      }

      function findDistance(p1,p2){  
        return Math.sqrt( Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) );
      }

       function checkYourself (a,b) {
        if (abs(a.vx) < ludicrousSpeed && abs(a.vy) < ludicrousSpeed && abs(b.vx) < ludicrousSpeed && abs(b.vy) < ludicrousSpeed) {
          return;
        }
        if (abs(a.vx) > ludicrousSpeed) {
          a.vx * .8;
        }
        if (abs(a.vy) > ludicrousSpeed) {
          a.vy * .8;
        }
        if (abs(b.vx) > ludicrousSpeed) {
          b.vx * .8;
        }
        if (abs(b.vy) > ludicrousSpeed) {
          b.vx * .8;
        }
        
    };
    function collide(a,b) {
      var dx = b.x - a.x;
          dy = b.y - a.y;
          d = hypot(dx, dy);
          ux = dx / d;
          uy = dy / d;

      if (d < a.rad + b.rad + buffer) {
        a.vx -= ux*0.5;
        a.vy -= uy*0.5;
        b.vx += ux*0.5;
        b.vy += uy*0.5;
      }

      checkYourself(a,b);
    }

    function keys(e){
      switch (e.keyCode) {
        case 38:  /* Up arrow was pressed */
          if (target.y - delY > 0){
            target.y -= delY;
          }
        break;
        case 40:  /* Down arrow was pressed */
          if (target.y + delY < h){
            target.y += delY;
          }
        break;
        case 37:  /* Left arrow was pressed */
          if (target.x - delX > 0){
            target.x -= delX;
          }
        break;
        case 39:  /* Right arrow was pressed */
          if (target.x + delX < w){
            target.x += delX;
          }
        break;
      }
    };

      function init(){
      for(var i = 0; i < patriclesNum; i++){
        particles.push(new Factory);
      }
    };