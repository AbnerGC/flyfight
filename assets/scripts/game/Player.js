cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        //飞机的移动速度
        moveSpeed: 0,
        maxSpeed:0,  
        bulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        game:{
            default:null,
            serializable:false
        },
        // bullte node
        bullteObj: null
    },

    init:function(gameCompontent){
       this.node.setPosition(cc.p(-100,-400));
       this.game = gameCompontent;
    },
    // use this for initialization
    onLoad: function () {
        this.node.group = 'Airplane';
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.bullteObj = cc.instantiate(this.bulletPrefab);
        this.bullteObj.getComponent('PlayerBullet').player = this;
        this.bullteObj.getComponent('PlayerBullet').canvas =  this.node.parent;
        this.accLeft = false;
        this.accRight = false;
        this.accTop = false;
        this.accBottom = false;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.onInputEvent();
    },

    destroyNode : function(){
         this.node.destroy();
    },

    onCollisionEnter: function (other, self) {
        //console.log('on collision enter');
           if(this.game.isGameover !== -1){
                this.destroyNode();
           }

    },
    onCollisionStay: function (other, self) {
        //console.log('on collision stay');
    },
    onCollisionExit: function (other, self) {
        //console.log('on collision exit');
        if(this.game.isGameover !== -1){
            this.game.spawnNewPlayer();
        }
    },
    onDestroy:function(){
        console.log('player node is destroy');
    },
    disManage: function(){
         var manager = cc.director.getCollisionManager();
         manager.enabled = false;
         manager.enabledDebugDraw = false;
         manager.enabledDrawBoundingBox = false;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //飞机移动逻辑
        if(true === this.accLeft ){
            this.xSpeed -= this.moveSpeed;
        }else if (true === this.accBottom){
            this.ySpeed -= this.moveSpeed;
        }else if(true === this.accRight){
           this.xSpeed += this.moveSpeed;
        }else if( true === this.accTop){
            this.ySpeed += this.moveSpeed;            
        }

        if(Math.abs(this.xSpeed) > this.maxSpeed){
            this.xSpeed = this.maxSpeed * this.xSpeed/Math.abs(this.xSpeed);
        }
        
        if(Math.abs(this.ySpeed) > this.maxSpeed){
            this.ySpeed = this.maxSpeed * this.ySpeed/Math.abs(this.ySpeed);
        }

        this.node.x += this.xSpeed * dt;
        this.node.y += this.ySpeed * dt;


        var canvasHalfWidth = this.node.parent.width/2;
        var playerHalfWidth = this.node.width/2; 
        
        var canvasHalfHight = this.node.parent.height/2;
        var playerHalfHight = this.node.height/2;
       
        if(this.node.x > canvasHalfWidth - playerHalfWidth){
            this.node.x = canvasHalfWidth -playerHalfWidth;
        }else if(this.node.x < -canvasHalfWidth + playerHalfWidth){
            this.node.x = -canvasHalfWidth + playerHalfWidth;
        }

        if(this.node.y > canvasHalfHight-playerHalfHight){
            this.node.y = canvasHalfHight-playerHalfHight;
        }else if(this.node.y < -canvasHalfHight + playerHalfHight){
            this.node.y = -canvasHalfHight + playerHalfHight;
        }

    },

    onInputEvent: function(){
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        self.accTop = false;
                        self.accBottom = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        self.accTop = false;
                        self.accBottom = false;
                        break;
                    case cc.KEY.w:
                        self.accLeft = false;
                        self.accRight = false;
                        self.accTop = true;
                        self.accBottom = false;   
                        break;
                    case cc.KEY.s:
                        self.accLeft = false;
                        self.accRight = false;
                        self.accTop = false;
                        self.accBottom = true;
                        break;
                    case cc.KEY.j:
                        self.bullteObj.getComponent('PlayerBullet').fireBullet();
                        break;            
                }
            },
            onKeyReleased: function(keyCode,event){
               switch(keyCode){
                   case cc.KEY.a:
                        self.accLeft = false;
                        break;
                   case cc.KEY.d:
                        self.accRight = false;
                        break;
                    case cc.KEY.w:
                        self.accTop = false;
                        break;
                    case cc.KEY.s:
                        self.accBottom = false;
                        break;                              
                }
                
                self.xSpeed = 0;
                self.ySpeed = 0;
                 
            }
        },this.node);
    }
});