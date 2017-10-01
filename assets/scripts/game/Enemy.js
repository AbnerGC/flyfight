cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        bulletObj:null,
        moveSpeed: 0,
        isMoving:false,
        curX:0,
        curY:0,
        targetX:0,
        targetY:0,
        topH:0,
        bottomH:0,
        leftW:0,
        rightW:0,
        timerIds:null,
         game:{
            default:null,
            serializable:false
        },
       
    },

    movingAction: function(crt,drt){

        var canvasHalfWidth = this.node.parent.width/2;
        var playerWidth = this.node.width/2; 
        var canvasHalfHight = this.node.parent.height/2;
        var playerHight = this.node.height/2;

        
        if(false ===  this.isMoving){
            this.isMoving = true;
            if(this.curX === 0 && this.curY === 0){
               
                this.curX = this.node.x;
                this.curY = this.node.y;
                this.leftW = canvasHalfWidth - playerWidth - 80;
                this.rightW  =  -canvasHalfWidth + playerWidth + 80;

                this.bottomH = -canvasHalfHight + playerHight +180;
                this.topH = canvasHalfHight-playerHight -canvasHalfHight;

            }
            this.targetX = this.curX + Math.random() * canvasHalfWidth * drt;
            this.targetY = this.curY + Math.random() * canvasHalfHight * drt;

            if( this.targetX <  this.rightW){
                this.targetX =  -this.rightW + 50;
            }else if(this.targetX > this.leftW){
               this.targetX =  -this.leftW -50;
            }

            if( this.targetY <  this.bottomH){
                this.targetY =  -this.bottomH + 50;
            }else if(this.targetY > this.topH){
               this.targetY =  -this.topH -50;
            }
            let cb = cc.callFunc(this.moveEnd, this);
            let v1 = cc.v2(this.curX,this.curY);
            let v2 = cc.v2(this.targetX,this.targetY);
            let distance = cc.pDistance(v1,v2);
            let autoMoveDuration = distance/this.moveSpeed;
            let moving = cc.moveTo(autoMoveDuration, cc.p({x:this.targetX,y:this.targetY}));
            this.node.runAction(cc.repeat(cc.sequence(moving,cb),1));
        }
        
    },

    moveEnd: function(){
        this.isMoving = false;
        this.curX = this.targetX;
        this.curY = this.targetY;
    },
    
    autoMoving: function(){
    
        let direction = [-1,1];
        let coordinate = ['x','y'];
        let rdDrt = Math.floor(Math.random() * 2);
        let rdCdt = Math.floor(Math.random() * 2);
        let drt = direction[rdDrt];
        let crt = coordinate[rdCdt];
        this.movingAction(crt,drt);
    },

    autoFire: function(){
       this.bullteObj.getComponent('EnemyBullet').fireBullet();
    },
    // use this for initialization
    onLoad: function () {
        this.node.group = 'Enemyplane';
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
        manager.enabledDrawBoundingBox = false;
        this.timerIds = [];
        this.bullteObj = cc.instantiate(this.bulletPrefab);
         this.bullteObj.getComponent('EnemyBullet').player =  this;
        this.bullteObj.getComponent('EnemyBullet').canvas =  this.node.parent;
    },

    addToTimerIdsList: function(timerId){
        this.timerIds.push(timerId);
    },

    aiFire:function(){  
        let autoFireAction = setInterval(()=>{
              this.autoFire();
        },100);
        this.addToTimerIdsList(autoFireAction);
    },

     aiMoving:function(){
        let autoMovingAction = setInterval(()=>{
              this.autoMoving()
        },500);
    
       this.addToTimerIdsList(autoMovingAction);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
         
    },
    init:function(gameCompontent){
        this.game = gameCompontent;
        this.node.setPosition(cc.p(20 + (cc.random0To1()*200),50 + (cc.random0To1()*200)));
        this.aiFire();
        this.aiMoving();
    },
    disManage: function(){
         var manager = cc.director.getCollisionManager();
         manager.enabled = false;
         manager.enabledDebugDraw = false;
         manager.enabledDrawBoundingBox = false;
    },
    onDestroy: function(){
        console.log('this node will be destroy');
        if(this.timerIds.length > 0){
         this.timerIds.forEach(function(element) {
                console.log('element',element);
                clearInterval(element);
            }, this);
        }
    },
    destroyNode : function(){
         this.node.destroy();
         Global.score += 100;
         this.game.scoreLabel.string  = 'score :' + Global.score ;
    },

    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
           if(this.game.isGameover !== -1){
                this.destroyNode();
           }

    },
    onCollisionStay: function (other, self) {
        console.log('on collision stay');
    },
    onCollisionExit: function (other, self) {
        
        console.log('on collision exit');
        if(this.game.isGameover !== -1){
            this.game.spawnEnemy();
        }
    },
});
